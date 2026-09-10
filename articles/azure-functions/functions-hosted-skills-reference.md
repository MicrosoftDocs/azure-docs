---
title: Azure Functions hosted skills reference
description: "Reference for agent file fields, app configuration, MCP servers, skills, tools, model providers, managed identity, and built-in endpoints in Azure Functions hosted skills."
ms.topic: reference
ms.date: 08/25/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer using Azure Functions hosted skills, I want a reference for all configuration fields and options so that I can correctly configure my app.
---

# Azure Functions hosted skills reference

This article provides the configuration reference for Azure Functions hosted skills. For an overview of the runtime and guidance on when to use it, see [Azure Functions hosted skills](functions-hosted-skills.md).

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

## Agent file reference

An agent file (`.agent.md`) uses YAML front matter to configure the agent, followed by markdown instructions.

### Front-matter fields

Use these front matter fields to configure an agent:

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Display name for the agent. |
| `description` | Yes | Short description of what the agent does and when it should be used. |
| `trigger` | Yes (unless `builtin_endpoints` is enabled) | Defines how the agent is invoked. Only one trigger is allowed per agent file. |
| `builtin_endpoints` | No | Enables built-in debug and composition endpoints. Use `true` to enable all built-in endpoints, or configure `debug_chat_ui`, `chat_api`, and `mcp` individually. `debug_chat_ui: true` also enables the backing `chat` and `chatstream` [endpoint routes](#endpoint-routes) because the built-in UI calls those APIs. |
| `input_schema` | No | JSON Schema used to validate HTTP request bodies for HTTP-triggered agents. |
| `logger` | No | Controls whether runtime logging is enabled for the agent. Defaults to `true`. |
| `mcp` | No | Controls access to MCP servers discovered from [`mcp.json`](#mcp-server-configuration-mcpjson). Use `false` to disable MCP servers for this agent, or use `exclude` to remove specific servers. |
| `metadata` | No | Custom metadata for your own organization or tooling. |
| `model` | No | Overrides the default model configured in [`agents.config.yaml`](#app-wide-configuration-agentsconfigyaml) or app settings. |
| `response_example` | No | Example response shape used to guide structured responses from HTTP-triggered agents. |
| `response_schema` | No | JSON Schema used to validate structured responses returned by HTTP-triggered agents. |
| `skills` | No | Controls access to discovered [skills](#skills). Use `false` to disable skills for this agent, or use `exclude` to remove specific skills. |
| `substitute_variables` | No | Controls whether [environment variable substitution](#variable-substitution) is applied to the front matter and instructions. Defaults to `true`. |
| `system_tools` | No | Lets an agent opt out of configured system tools, such as [sandboxed execution](#sandboxed-execution). |
| `timeout` | No | Overrides the default execution timeout, in seconds. |
| `tools` | No | Controls access to discovered [custom Python tools](#custom-python-tools). Use `false` to disable custom tools for this agent, or use `exclude` to remove specific tools. |
| `workflows` | No | Enables experimental dynamic workflows, filters workflow-safe tools, and grants access to workflow subagents. For more information, see [Dynamic workflows in Azure Functions hosted skills](functions-hosted-skills-dynamic-workflows.md). |

### Trigger configuration

Each agent file supports one trigger, defined in the `trigger` object in the front matter.

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | The trigger binding type. See the [supported types table](#supported-trigger-types) for allowed values. |
| `args` | Depends on type | Trigger-specific settings that configure which event starts the agent. |

### Supported trigger types

The following table lists the supported `trigger.type` values, their required `args`, and links to the full per-type reference:

| `trigger.type` | Required `args` | Reference |
| --- | --- | --- |
| `http_trigger` | `route` | [HTTP trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#http-trigger) |
| `timer_trigger` | `schedule` | [Timer trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#timer-triggers) |
| `queue_trigger` | `queue_name`, `connection` | [Queue trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#queue-trigger) |
| `blob_trigger` | `path`, `connection` | [Blob trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#blob-trigger) |
| `event_grid_trigger` | (none) | [Event Grid trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#event-grid-trigger) |
| `event_hub_message_trigger` | `event_hub_name`, `connection` | [Event Hub trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#event-hub-trigger) |
| `service_bus_queue_trigger` | `queue_name`, `connection` | [Service Bus queue trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#service-bus-queue-trigger) |
| `service_bus_topic_trigger` | `topic_name`, `subscription_name`, `connection` | [Service Bus topic trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#service-bus-topic-trigger) |
| `cosmos_db_trigger` | `connection`, `database_name`, `container_name` | [Cosmos DB trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#cosmos-db-trigger) |
| `cosmos_db_trigger_v3` | `database_name`, `collection_name`, `connection_string_setting` | [Cosmos DB trigger v3](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#cosmos-db-trigger-v3) |
| `sql_trigger` | `table_name`, `connection_string_setting` | [SQL trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#sql-trigger) |
| `mysql_trigger` | `table_name`, `connection_string_setting` | [MySQL trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#mysql-trigger) |
| `kafka_trigger` | `topic`, `broker_list` | [Kafka trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#kafka-trigger) |
| `dapr_binding_trigger` | `binding_name` | [Dapr binding trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#dapr-binding-trigger) |
| `dapr_service_invocation_trigger` | `method_name` | [Dapr service invocation trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#dapr-service-invocation-trigger) |
| `dapr_topic_trigger` | `pub_sub_name`, `topic` | [Dapr topic trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#dapr-topic-trigger) |
| `generic_trigger` | `type` (binding type name) | [Generic trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#generic-trigger) |
| `connector_trigger` | Configured in the [Connector Namespace](./functions-connectors-overview.md). | [Connector trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#connector-triggers) |

### Trigger examples

The following examples show common trigger configurations:

- Timer trigger (runs [daily at 3:00 PM UTC](./functions-bindings-timer.md#ncrontab-expressions))

```yaml
trigger:
  type: timer_trigger
  args:
    schedule: "0 0 15 * * *"
```

- HTTP trigger

```yaml
trigger:
  type: http_trigger
  args:
    route: summarize
    auth_level: FUNCTION
```

- Queue trigger

```yaml
trigger:
  type: queue_trigger
  args:
    queue_name: work-items
    connection: AzureWebJobsStorage
```

- Blob trigger

```yaml
trigger:
  type: blob_trigger
  args:
    path: uploads/{name}
    connection: AzureWebJobsStorage
```

## App-wide configuration (agents.config.yaml)

Use `agents.config.yaml` for app-wide runtime defaults that every agent can inherit. The runtime can load an app without this file. Add it when you need shared settings such as a model deployment, timeout, or sandbox execution endpoint.

This file is one app-level input. The runtime also discovers MCP servers from [`mcp.json`](#mcp-server-configuration-mcpjson), skills from [`skills/`](#skills), and custom Python tools from [`tools/`](#custom-python-tools). Those capabilities are enabled on agents by default. Agent front matter can override runtime defaults or filter inherited MCP servers, skills, and tools.

```yaml
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: $ACA_SESSION_POOL_ENDPOINT

model: $FOUNDRY_MODEL
timeout: 900
```

Individual agents can override supported runtime settings in their own front matter.

### Configuration fields

Use these top-level fields in `agents.config.yaml`:

| Field | Required | Description |
| --- | --- | --- |
| `model` | No | Default model or model deployment used by agents that don't set `model` in their own front matter. |
| `timeout` | No | Default execution timeout, in seconds. The runtime default is 900 seconds. |
| `system_tools.dynamic_sessions_code_interpreter.endpoint` | When using sandboxed execution | Management endpoint for the Azure Container Apps dynamic session pool used by sandbox tools. |
| `system_tools.dynamic_sessions_code_interpreter.client_id` | No | Client ID of the managed identity used to call the session pool. |
| `tools.exclude` | No | Global exclude list for custom Python tools discovered from the `tools/` folder. |

### Resolution order

The runtime resolves values from agent front matter first, then `agents.config.yaml`, then app settings and runtime defaults. String values in `agents.config.yaml` can reference app settings, such as `$AZURE_OPENAI_DEPLOYMENT` or `$ACA_SESSION_POOL_ENDPOINT`.

Keep model, timeout, and system tool defaults in `agents.config.yaml`. Keep remote MCP server definitions, including MCP server endpoints from connector namespaces, in `mcp.json`.

## Variable substitution

The runtime can substitute app settings and environment variables into string values in agent front matter, agent instruction bodies, `agents.config.yaml`, and `mcp.json`. 

For substitutions, use either `$SETTING_NAME` or `%SETTING_NAME%`. The runtime handles these two formats the same way. Variable names must start with a letter or underscore and can contain letters, numbers, and underscores.

```yaml
model: $FOUNDRY_MODEL
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: %ACA_SESSION_POOL_ENDPOINT%
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

Substitution rules:

+ Applies to string values, including strings nested in objects or lists. Doesn't apply to object keys.
+ Fenced code blocks in agent instruction bodies aren't substituted, so examples can include literal `$VALUE` or `%VALUE%` text.
+ Use `$$SETTING_NAME` or `%%SETTING_NAME%%` for literal placeholders in substituted content.
+ Missing variables are left unchanged. Empty values resolve to empty strings.
+ Substitution is a single pass. The `${SETTING_NAME}` syntax isn't supported.
+ To disable substitution for one agent, set `substitute_variables: false` in the agent file. This setting doesn't disable substitution in `agents.config.yaml` or `mcp.json`.

## MCP server configuration (mcp.json)

When an app uses remote MCP servers, add `mcp.json` to the root of the function app project. The runtime discovers remote HTTP or streamable HTTP MCP servers from this file and makes their tools available to agents, subject to any per-agent filters.

### Server entry fields

Use these fields in each `servers` entry:

| Field | Required | Description |
| --- | --- | --- |
| `type` | Yes | Use `http` or `streamable-http`. The runtime doesn't support local `stdio` MCP servers. |
| `url` | Yes | Remote MCP server endpoint. Environment variable substitution is supported. |
| `headers` | No | Static headers for a generic remote MCP server. Don't store static secrets in `mcp.json`. |
| `auth.scope` | When using Microsoft Entra authentication | Microsoft Entra token scope used to authenticate calls to the MCP server. |
| `auth.client_id` | No | Client ID of the managed identity to use when authenticating with this MCP server. Omit this field to use the function app's system-assigned managed identity in Azure. |

### Authentication

Use the Azure API Hub scope when the agent consumes a managed MCP server from a connector namespace. Don't store user secrets in `mcp.json`.

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

The `auth.client_id` setting selects which managed identity authenticates with the MCP server. Set it to the client ID of a user-assigned managed identity. Omit it to use the function app's system-assigned managed identity in Azure. The selected identity, or your local developer identity when you run locally, must be allowed to call the MCP server.

## Azure connectors

Connectors let agents work with external services without custom API client code. For example, a Microsoft 365 Outlook connector can send email, a Teams connector can work with messages, and other connectors can call actions in systems such as Salesforce, SAP, or SQL. A [Connector Namespace](../connector-namespace/connector-namespace-overview.md) hosts the connections, triggers, and MCP servers that make those integrations available to your app.

To use connector capabilities in a hosted skills app, first create a Connector Namespace resource, create a connection to the service, and authorize that connection. Then choose how the task uses the connection:

+ **Connector triggers** start agents when something happens in a connected service, such as a new email, Teams message, or calendar event. To use one, create a trigger in the Connector Namespace that uses the authorized connection, and then configure the agent with the trigger name and arguments from that connector trigger definition.
+ **Connector MCP tools** let agents call service actions, such as sending email or updating a record. To use them, create an MCP server in the Connector Namespace that uses the authorized connection, and then add the MCP server endpoint to [`mcp.json`](#mcp-server-configuration-mcpjson).

For more information, see [Use connectors in Azure Functions](functions-connectors-overview.md).

## Skills

Store reusable prompt assets under `skills/`. They help keep the base agent instructions small while making domain-specific instructions available when needed. The runtime uses the [Agent Skills](https://agentskills.io/) format.

### Skill format

The runtime scans `skills/` in the function app project root and recursively discovers folders that contain `SKILL.md`.

```text
skills/
  incident-response/
    SKILL.md
    triage-checklist.md
    escalation-policy.md
```

The `SKILL.md` file contains YAML front matter followed by markdown instructions.

```markdown
---
name: incident-response
description: Triage production incidents, summarize impact, and recommend next steps. Use when the task mentions incidents, outages, alerts, or severity levels.
---

Follow the incident response checklist in [triage-checklist.md](triage-checklist.md).
```

### Authoring rules

Follow these guidelines when creating your agent files and other project resources:

+ Every skill folder must contain a `SKILL.md` file.
+ The `name` and `description` fields are required.
+ Use lowercase letters, numbers, and single hyphens for skill names. Don't use spaces, underscores, uppercase letters, leading hyphens, trailing hyphens, or repeated hyphens.
+ Skill names must be unique across the app.
+ The description should explain both what the skill does and when the agent should use it. The runtime loads skill names and descriptions first so the agent can decide when to load the full skill.
+ Skills can include multiple markdown files in the same skill folder. Reference supporting markdown files from `SKILL.md` by using relative links.
+ The Azure Functions hosted skills support only markdown files as skill content. If a skill needs executable behavior, package that code as a [custom Python tool](#custom-python-tools) and refer to the tool by name from the skill instructions.

### Filtering skills per agent

Agents inherit all discovered skills by default. Disable or exclude skills in an agent file when a specific agent shouldn't use them:

```yaml
skills: false
```

```yaml
skills:
  exclude:
    - incident-response
```

## Sandboxed execution

For code execution or browser automation, the runtime can use [Azure Container Apps dynamic sessions](../container-apps/sessions.md). Dynamic sessions provide isolated environments from [session pools](../container-apps/session-pool.md). The runtime uses [code interpreter sessions](../container-apps/sessions-code-interpreter.md) to provide an `execute_python` tool to agents.

### Configuration

Configure sandboxed execution in `agents.config.yaml`:

```yaml
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: $ACA_SESSION_POOL_ENDPOINT
```

### Requirements

+ The session pool must be a Python code interpreter session pool, such as a pool created with `--container-type PythonLTS`.
+ The `endpoint` value is the session pool management endpoint.
+ In Azure, the [managed identity](#managed-identity-configuration) used by the function app must have the role assignments required to execute code in the session pool. Azure Container Apps code interpreter sessions require the `Azure ContainerApps Session Executor` and `Contributor` roles on the session pool.
+ When running locally, your developer identity must have the same required access to the session pool.
+ To use a user-assigned managed identity for sandboxed execution, set `system_tools.dynamic_sessions_code_interpreter.client_id` to the client ID of the identity that has the required role assignments. If this setting isn't set, the runtime uses `AZURE_CLIENT_ID`, then the default credential chain.

The sandbox tool runs Python in an isolated session. Variables, imports, and files can persist across tool calls in the same agent session. When no agent session ID is available, the runtime uses a fresh sandbox session so unrelated executions don't share state.

### Disabling per agent

Agents inherit sandboxed execution when it's configured globally. You can disable execution for a specific agent by setting `dynamic_sessions_code_interpreter` to `false` in the agent file.

```yaml
system_tools:
  dynamic_sessions_code_interpreter: false
```

## Custom Python tools

Use custom Python tools when you need app-specific logic that the runtime's built-in capabilities don't cover. Custom tools run in the function app process, not in a [sandboxed session](#sandboxed-execution).

### Tool discovery

Add tool files to the `tools/` folder in the function app project root:

```text
tools/
  submit_ticket.py
  lookup_customer.py
```

The runtime discovers `.py` files in `tools/` whose file names don't start with `_`. The runtime registers the first supported tool from each file. Use one tool per file to keep discovery predictable.

### Defining tools

Define a tool by decorating a function with `@tool` from the runtime package:

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

### Filtering tools per agent

Agents inherit discovered custom tools by default. Disable or exclude custom tools in an agent file when a specific agent shouldn't use them:

```yaml
tools: false
```

```yaml
tools:
  exclude:
    - submit_ticket
```

## Model provider configuration

The runtime supports these model providers, including Azure OpenAI, Azure AI Foundry, and OpenAI.

### Provider selection

You must configure at least one provider signal for the runtime to create a chat client. You can explicitly set the provider by using the `AZURE_FUNCTIONS_AGENTS_PROVIDER` setting or let the runtime infer the provider from your other app settings.

Use these provider settings:

| Provider | `AZURE_FUNCTIONS_AGENTS_PROVIDER` value | Required settings | Optional settings | Model setting behavior |
| --- | --- | --- | --- | --- |
| Azure AI Foundry | `foundry` | `FOUNDRY_PROJECT_ENDPOINT` | `AZURE_CLIENT_ID` when you want a user-assigned managed identity | Set `FOUNDRY_MODEL` to the model deployment name that the Foundry project should use. |
| Azure OpenAI | `azure_openai` | `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT` | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_API_VERSION`, `AZURE_CLIENT_ID` when you want a user-assigned managed identity | Set `AZURE_OPENAI_DEPLOYMENT` to the Azure OpenAI deployment name. |
| OpenAI | `openai` | `OPENAI_API_KEY` | None | Set `AZURE_FUNCTIONS_AGENTS_MODEL` to the OpenAI model name when you don't pass a model in agent or runtime configuration. |

When you don't set `AZURE_FUNCTIONS_AGENTS_PROVIDER`, the runtime auto-detects the provider in this order:

1. `AZURE_OPENAI_ENDPOINT` selects Azure OpenAI.
1. `FOUNDRY_PROJECT_ENDPOINT` selects Azure AI Foundry.
1. `OPENAI_API_KEY` selects OpenAI.

When you rely on auto-detection, the provider-specific setting that identified the provider still needs to be accompanied by the provider's required model setting. For example, `FOUNDRY_PROJECT_ENDPOINT` still needs `FOUNDRY_MODEL`, and `AZURE_OPENAI_ENDPOINT` still needs `AZURE_OPENAI_DEPLOYMENT`.

`AZURE_FUNCTIONS_AGENTS_MODEL` is a runtime-wide fallback model setting. Its valid values depend on the active provider:

+ For Azure AI Foundry, use a model deployment name that exists in the Foundry project, such as `gpt-5.4`.
+ For Azure OpenAI, use the deployment name only if you intentionally want the runtime-wide fallback. In most apps, set `AZURE_OPENAI_DEPLOYMENT` instead.
+ For OpenAI, use the model name accepted by the OpenAI API, such as `gpt-4o-mini`.

### Model precedence

Model selection follows this general precedence order:

1. The model requested by the agent or runtime call.
1. Provider-specific settings, such as `AZURE_OPENAI_DEPLOYMENT` or `FOUNDRY_MODEL`.
1. The model set in `AZURE_FUNCTIONS_AGENTS_MODEL`.
1. The active provider's built-in default model.

## Managed identity configuration

The runtime uses managed identities when connecting to Azure resources that support Microsoft Entra authentication. Use `AZURE_CLIENT_ID` as the app's default identity selector, or use feature-specific settings for finer control:

| Runtime feature | Identity setting | Fallback<sup>1</sup> |
| --- | --- | --- |
| Azure OpenAI model provider<sup>2</sup> | `AZURE_CLIENT_ID` | `DefaultAzureCredential` |
| Azure AI Foundry model provider | `AZURE_CLIENT_ID` | `DefaultAzureCredential` |
| Azure Container Apps dynamic sessions sandbox | `system_tools.dynamic_sessions_code_interpreter.client_id` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |
| MCP servers hosted in connector namespaces | The `auth.client_id` value in the server entry in `mcp.json` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |
| Blob-backed session history<sup>3</sup> | `AzureWebJobsStorage__clientId` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |

1. When you don't configure an identity setting, the runtime uses [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential), which resolves to the system-assigned managed identity in Azure and your developer identity (Azure CLI or Visual Studio) locally.
1. When you configure an API key in Azure OpenAI (using `AZURE_OPENAI_API_KEY`), the model provider uses the key instead of a managed identity. For more information, see [Azure OpenAI extension for Azure Functions](functions-bindings-openai.md#connections).
1. Session history uses the same default host storage identity configuration as the Azure Functions host. Use `AzureWebJobsStorage`, `AzureWebJobsStorage__blobServiceUri`, and `AzureWebJobsStorage__clientId` to configure identity-based storage for blob-backed history. The runtime doesn't use a separate agent-specific identity setting for session history. For more information, see [Define connections](manage-connections.md?tabs=host&pivots=functions-auth-identity#define-connections) in the Functions developer guide.

## Built-in endpoints

The runtime exposes optional built-in endpoints when an agent opts in through the `builtin_endpoints` settings in its front matter. These endpoints are useful for development, testing, and diagnostics. They're not designed as the primary production application interface.

Enable built-in endpoints in the agent's front matter:

```yaml
builtin_endpoints:
  debug_chat_ui: true
  chat_api: true
  mcp: true
```

Setting `debug_chat_ui: true` also enables the `chat` and `chatstream` APIs because the UI depends on them. Set `chat_api: true` by itself when you want programmatic chat access without the debug UI.

### Endpoint routes

The `<AGENT_NAME>` route segment comes from the `.agent.md` file name, not the display `name` field. For example, `main.agent.md` uses `/agents/main/`.

| Surface | Route | Key requirement |
| --- | --- | --- |
| Chat UI | `/agents/<AGENT_NAME>/` | Function key (prompted in browser). |
| HTTP chat API | `POST /agents/<AGENT_NAME>/chat` | Function key. |
| Streaming chat API | `POST /agents/<AGENT_NAME>/chatstream` | Function key. |
| MCP endpoint | `/runtime/webhooks/mcp` | `mcp_extension` system key. |

### Retrieving keys

When you host the chat UI in Azure, it prompts for a function key before it sends messages. You can use the key when calling the HTTP chat APIs directly. 

Use the following [`az functionapp keys list`](/cli/azure/functionapp/keys#az-functionapp-keys-list) command to retrieve the default function key for your app: 

```azurecli
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "functionKeys.default" \
  --output tsv
```

In this example, replace `<RESOURCE_GROUP>` and `<FUNCTION_APP_NAME>` with your group and app names. You can include the returned key in the `x-functions-key` header or a `code` query string parameter in the HTTP request to the endpoint. 

When connecting to an MCP client, instead request the MCP extension system using the following command:

```azurecli
az functionapp keys list \
  --resource-group <RESOURCE_GROUP> \
  --name <FUNCTION_APP_NAME> \
  --query "systemKeys.mcp_extension" \
  --output tsv
```

The MCP endpoint requires this system key.

### Chat API request flow

Both built-in chat APIs expect a JSON body with a `prompt` field:

```json
{
  "prompt": "Summarize today's failures."
}
```

Use `POST /agents/<AGENT_NAME>/chat` when you want one JSON response. The response body includes `session_id`, `response`, and `tool_calls`. The runtime also echoes the same session ID in the `x-ms-session-id` response header.

Use `POST /agents/<AGENT_NAME>/chatstream` when you want Server-Sent Events (SSE). The stream begins with a `session` event that contains the resolved session ID, followed by zero or more `delta`, `intermediate`, `tool_start`, and `tool_end` events, and ends with either `done` or `error`.

To continue a multiturn conversation, send the session ID from the earlier response in the `x-ms-session-id` request header on later `chat` or `chatstream` calls. If you omit that header, the runtime creates a new session automatically.

```http
POST /agents/main/chatstream HTTP/1.1
Content-Type: application/json
Accept: text/event-stream
x-ms-session-id: <SESSION_ID_FROM_A_PREVIOUS_RESPONSE>

{"prompt":"Continue the last summary and add blockers."}
```

## Sessions and state

Multi-turn agent interactions require session history. The runtime manages session storage automatically based on the environment:

| Environment | Storage | Configuration |
| --- | --- | --- |
| Azure | Blob Storage in the default host storage account (`AzureWebJobsStorage`) | Connection-string or identity-based (preferred). See [Managed identity configuration](#managed-identity-configuration). |
| Local development | File-based under the local agents configuration directory | No configuration needed. |

The runtime doesn't require a separate session database. [Sandboxed execution](#sandboxed-execution) is also session-aware: when no explicit session ID is available, the runtime uses a fresh isolated sandbox session so unrelated invocations don't share state.

## Supported hosting plans

Azure Functions hosted skills support these Azure Functions hosting plans:

| Plan | Serverless scaling | Notes |
| --- | --- | --- |
| [Flex Consumption](flex-consumption-plan.md) | Yes | Scale-to-zero, per-second billing, and automatic scaling. Recommended for most workloads. |
| [Premium](functions-premium-plan.md) | Yes | Pre-warmed instances, virtual network integration, and unlimited execution duration. Use for workloads that need consistent low latency or private networking. |
| [Dedicated (App Service)](dedicated-plan.md) | No | Always-on instances with manual or rule-based scaling. Use when you already have App Service plan capacity. |

All plans support managed identity, virtual network integration, and Application Insights.

## Related content

+ [Azure Functions hosted skills](functions-hosted-skills.md)
+ [Build an event-driven AI app using Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
