---
title: Azure Functions hosted skills reference
description: "Reference for agent file fields, app configuration, MCP servers, skills, tools, model providers, managed identity, and built-in endpoints in Azure Functions hosted skills."
ms.topic: reference
ms.date: 11/07/2026
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

This reference describes version `0.1.0b17` of the `azurefunctions-agents-runtime` package.

For development examples, see the [Azure Functions hosted skills developer guide](functions-hosted-skills-developer-guide.md).

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

## Agent file reference

An agent file (`.agent.md`) contains YAML front matter for configuration and Markdown instructions.

The runtime discovers agent files in the function app project root and in an `agents/` or `Agents/` folder. It recognizes `*.agent.md` and `*.claude.md` suffixes without regard to case. It also recognizes the bare names `agent.md` and `CLAUDE.md` as aliases for `main.agent.md`. It doesn't recursively scan nested agent folders.

The file name determines the agent's identity slug, function name, and built-in endpoint route segment; the display `name` doesn't. The runtime replaces characters other than letters, numbers, and underscores with underscores, trims leading and trailing underscores, and prefixes names that start with a number with `fn_`. For example, `daily-report.agent.md` becomes `daily_report`. Slugs must be unique across the app.

### Front-matter fields

Use these front matter fields to configure an agent:

| Field | Type | Required | Default when omitted | Description |
| --- | --- | --- | --- | --- |
| `name` | String | Yes | None | Display name for the agent. |
| `description` | String | Yes | None | Short description of what the agent does and when it should be used. |
| `agent_configuration` | Object or `null` | No | Inherits app-wide configuration | Portable execution settings. Currently supports only [`max_output_tokens`](#agent-execution-configuration). |
| `trigger` | Object | No | No trigger | Defines an automatically registered invocation surface. Only one trigger is allowed per agent file. |
| `builtin_endpoints` | Boolean or object | No | All endpoints disabled | Use `true` to enable all [built-in endpoints](#built-in-endpoints), or configure `debug_chat_ui`, `chat_api`, and `mcp` individually. `debug_chat_ui: true` also enables the backing chat APIs and history route. |
| `input_schema` | Object | No | No validation | JSON Schema used to validate HTTP request bodies for explicitly HTTP-triggered agents. |
| `logger` | Boolean | No | `true` | Controls response logging for triggered agents. |
| `mcp` | Boolean or object | No | All discovered servers enabled | Controls access to servers in [`mcp.json`](#mcp-server-configuration-mcpjson). Use `false` to disable them or `exclude` to remove named servers. To expose the agent as an MCP tool, use `builtin_endpoints.mcp` instead. |
| `metadata` | Object | No | Empty object | Custom metadata for your own organization or tooling. |
| `model` | String | No | Inherits runtime configuration | Overrides the [model](#model-precedence) configured in `agents.config.yaml` or app settings. |
| `response_example` | String | No | None | Example response, such as a multiline JSON string, used to guide structured responses from explicitly HTTP-triggered agents. |
| `response_schema` | Object | No | No validation | JSON Schema used to validate structured responses returned by explicitly HTTP-triggered agents. |
| `skills` | Boolean or object | No | All discovered skills enabled | Use `false` to disable [skills](#skills) or `exclude` to remove skills by directory name. |
| `subagents` | Array of objects | No | Empty array | Grants permission to delegate to named agents. See [Subagent references](#subagent-references). |
| `substitute_variables` | Boolean | No | `true` | Enables [environment variable substitution](#variable-substitution) in the front matter and instructions. |
| `system_tools` | Object | No | Inherits app-wide settings | Per-agent Boolean overrides for `dynamic_sessions_code_interpreter` and `web_request`. Set either to `false` to opt out. |
| `timeout` | Number | No | Inherits runtime configuration | Execution timeout in seconds. See [Resolution order](#resolution-order). |
| `tools` | Boolean or object | No | All custom tools except global exclusions | Use `false` to disable custom Python tools and the sandbox and `web_request` system tools. Use `exclude` to remove named custom tools. |
| `workflows` | Object | No | Disabled | Enables experimental dynamic workflows, filters workflow-safe tools, and grants access to workflow subagents. See [Dynamic workflows in Azure Functions hosted skills](functions-hosted-skills-dynamic-workflows.md). |

An agent can omit both `trigger` and `builtin_endpoints`. The runtime keeps the definition in the app's catalog but doesn't register an external invocation surface. You can use the definition through the [Hosted Skill binding](functions-hosted-skills-bindings.md) or a subagent reference.

The configuration schemas reject unknown fields. Put free-form content in `metadata` or the Markdown instruction body, not in additional front-matter configuration fields.

### Agent execution configuration

Use `agent_configuration` in `agents.config.yaml` for shared settings, or in agent front matter for an override:

```yaml
agent_configuration:
  max_output_tokens: 4096
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `max_output_tokens` | Positive integer or `null` | `null` | Maximum output tokens for the model SDK. Use a positive integer, not a Boolean value. When you omit the setting or set it to `null`, the SDK or model default applies. |

If you omit agent-level `agent_configuration`, the agent inherits the global value. An empty object (`{}`) also inherits `max_output_tokens`. Set `max_output_tokens: null` to clear the inherited limit, or `agent_configuration: null` to clear the inherited configuration. The runtime currently supports only `max_output_tokens` in this configuration.

### Subagent references

Each `subagents` entry must use object form:

```yaml
subagents:
  - agent: incident_response
    when: Use for incident triage and escalation.
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent` | String | Yes | Identity slug of another agent discovered in the same app, such as `incident_response` for `incident-response.agent.md`. |
| `when` | String | No | Routing hint for the delegation tool description. If you omit the hint or leave it blank, the runtime uses the specialist's `description`. |

The runtime exposes a `delegate_<slug>` tool for each reference. Use object form and reference each specialist only once. The runtime rejects self-references, unknown slugs, duplicate references, and collisions with existing tool names. These references are separate from `workflows.subagents`, which grants access to specialists from dynamic workflows.

### Trigger configuration

Each agent file supports one trigger. Define it in the `trigger` object in the front matter.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | String | Yes | The trigger binding type. See the [supported types table](#supported-trigger-types) for allowed values. |
| `args` | Object | Depends on type | Trigger-specific settings that configure which event starts the agent. Defaults to an empty object. |

### Supported trigger types

The following table lists the supported `trigger.type` values, their required `args`, and links to the full per-type reference:

| `trigger.type` | Required `args` | Reference |
| --- | --- | --- |
| `http_trigger` | `route` | [HTTP trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#http-trigger) |
| `timer_trigger` | `schedule` | [Timer trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#timer-triggers) |
| `queue_trigger` | `queue_name`, `connection` | [Queue trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#queue-trigger) |
| `blob_trigger` | `path` (`connection` defaults to `AzureWebJobsStorage`) | [Blob trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#blob-trigger) |
| `event_grid_trigger` | (none) | [Event Grid trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#event-grid-trigger) |
| `event_hub_message_trigger` | `event_hub_name`, `connection` | [Event Hub trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#event-hub-trigger) |
| `service_bus_queue_trigger` | `queue_name`, `connection` | [Service Bus queue trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#service-bus-queue-trigger) |
| `service_bus_topic_trigger` | `topic_name`, `subscription_name`, `connection` | [Service Bus topic trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#service-bus-topic-trigger) |
| `cosmos_db_trigger` | `connection`, `database_name`, `container_name` | [Cosmos DB trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#cosmos-db-trigger) |
| `cosmos_db_trigger_v3` | `database_name`, `collection_name`, `connection_string_setting` | [Cosmos DB trigger v3](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#cosmos-db-trigger-v3) |
| `sql_trigger` | `table_name`, `connection_string_setting` | [SQL trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#sql-trigger) |
| `mysql_trigger` | `table_name`, `connection_string_setting` | [MySQL trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#mysql-trigger) |
| `kafka_trigger` | `topic`, `broker_list` | [Kafka trigger](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/triggers.md#kafka-trigger) |
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
    http_auth: function
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

The runtime also discovers MCP servers from [`mcp.json`](#mcp-server-configuration-mcpjson), skills from [`skills/`](#skills), and custom Python tools from [`tools/`](#custom-python-tools). Agents enable these capabilities by default. Agent front matter can override runtime defaults or filter inherited MCP servers, skills, and tools.

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

| Field | Type | Default when omitted | Description |
| --- | --- | --- | --- |
| `agent_configuration` | Object or `null` | No output-token limit | Shared [execution configuration](#agent-execution-configuration). |
| `model` | String | App settings or provider default | Default model or deployment for agents without a front-matter override. |
| `timeout` | Number | App setting, then `900` | Default execution timeout in seconds. |
| `http_auth` | String or object | `function` | Default [HTTP authentication](#http-authentication) policy for built-in HTTP endpoints only. |
| `system_tools.dynamic_sessions_code_interpreter` | Object | Disabled | [Sandbox configuration](#sandboxed-execution). The object requires `endpoint` and optionally accepts `client_id`. |
| `system_tools.dynamic_sessions_code_interpreter.endpoint` | String | None | Session pool management endpoint. Required when sandbox configuration is present. |
| `system_tools.dynamic_sessions_code_interpreter.client_id` | String | Default identity selector | Managed identity client ID used to call the session pool. |
| `system_tools.web_request` | Boolean or object | Enabled | [Outbound HTTP tool](#outbound-http-requests). Use `false` to disable it app-wide, or an object to set limits. |
| `tools.exclude` | Array of strings | Empty array | Custom Python tool names excluded from every agent. Agent exclusions are added to this list. |

### Resolution order

For model selection, see [Model precedence](#model-precedence). For timeout, the order is agent front matter, `agents.config.yaml`, `AZURE_FUNCTIONS_AGENTS_TIMEOUT_SECONDS`, then the runtime default of 900 seconds. String values in `agents.config.yaml` can reference app settings, such as `$AZURE_OPENAI_DEPLOYMENT` or `$ACA_SESSION_POOL_ENDPOINT`.

System tool configuration is app-wide. Agents can opt out but can't supply their own sandbox endpoint or outbound HTTP limits. Setting an agent's system tool override to `true` doesn't enable a tool that's disabled or unconfigured globally.

Keep model, timeout, and system tool defaults in `agents.config.yaml`. Keep remote MCP server definitions, including MCP server endpoints from connector namespaces, in `mcp.json`.

## HTTP authentication

The runtime uses the same authentication policy shape for explicitly HTTP-triggered agents and built-in HTTP endpoints:

| Configuration location | Applies to | Default |
| --- | --- | --- |
| `trigger.args.http_auth` in agent front matter | The agent's explicit HTTP trigger | `function`; doesn't inherit app-wide `http_auth`. |
| `builtin_endpoints.http_auth` in agent front matter | Built-in chat, streaming, history, and enabled workflow status APIs | App-wide `http_auth`, then `function`. |
| `http_auth` in `agents.config.yaml` | Default for built-in HTTP APIs | `function`. |

Use a string such as `http_auth: function`, or an object with these fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | String | `function` | One of `function`, `admin`, `anonymous`, or `entra`. |
| `entra` | Object | None | Optional additional restrictions for `entra` mode. |
| `entra.tenant_id` | String | No additional restriction | Required tenant claim (`tid`). |
| `entra.allowed_audiences` | Array of strings | Empty array | Accepted audience claims (`aud`). |
| `entra.allowed_client_ids` | Array of strings | Empty array | Accepted caller application IDs (`appid` or `azp`). |

| Mode | Authentication requirement |
| --- | --- |
| `function` | Function or host key, supplied in `x-functions-key` or the `code` query parameter. |
| `admin` | Master key (`_master`). |
| `anonymous` | No Functions key or runtime Entra check. Any platform-level authentication still applies. |
| `entra` | A Microsoft Entra principal validated by App Service Authentication (Easy Auth), with any configured claim restrictions. A function key doesn't replace Entra authentication. |

For example, this app-wide policy applies to built-in HTTP APIs unless an agent overrides it:

```yaml
http_auth:
  mode: entra
  entra:
    tenant_id: $AZURE_TENANT_ID
    allowed_audiences:
      - $API_AUDIENCE
    allowed_client_ids:
      - $CALLER_CLIENT_ID
```

Entra mode requires [App Service Authentication](../app-service/overview-authentication-authorization.md) in front of the app. The runtime doesn't validate JWTs itself. It checks the principal that the platform validates. If Easy Auth enforcement or a valid Entra principal is missing, the runtime returns `401`. If the principal doesn't meet the configured claim restrictions, the runtime returns `403`. If you omit an allowlist or leave it empty, the runtime skips only that additional claim check.

The runtime recognizes the platform's `WEBSITE_AUTH_ENABLED` signal. `AZURE_FUNCTIONS_AGENTS_ENTRA_EASY_AUTH` is an operator assertion for environments where that signal isn't available; set it only when Easy Auth is actually enforced. It doesn't enable authentication or make a caller-supplied principal header trustworthy on its own.

The debug chat HTML page is anonymous at the Functions key layer; its backing APIs enforce the selected policy. These policies don't change authentication for the MCP extension endpoint.

The legacy `trigger.args.auth_level` field is deprecated. The runtime accepts its `function`, `admin`, and `anonymous` values without regard to case and logs a warning. If you set both fields, `http_auth` takes precedence.

## Variable substitution

The runtime can substitute app settings and environment variables into string values in agent front matter, agent instruction bodies, `agents.config.yaml`, and `mcp.json`. 

For substitutions, use either `$SETTING_NAME` or `%SETTING_NAME%`. The runtime handles these two formats the same way. Variable names must start with a letter or underscore and can contain letters, numbers, and underscores.

```yaml
model: $FOUNDRY_MODEL
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: "%ACA_SESSION_POOL_ENDPOINT%"
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

+ The runtime substitutes variables in string values, including strings nested in objects or lists. It doesn't substitute object keys.
+ The runtime doesn't substitute variables in fenced code blocks in agent instruction bodies. Examples can include literal `$VALUE` or `%VALUE%` text.
+ Use `$$SETTING_NAME` or `%%SETTING_NAME%%` for literal placeholders in substituted content.
+ The runtime leaves missing variables unchanged. Empty values resolve to empty strings.
+ Substitution is a single pass. The runtime doesn't support `${SETTING_NAME}` syntax.
+ To disable substitution for one agent, set `substitute_variables: false` in the agent file. This setting doesn't disable substitution in `agents.config.yaml` or `mcp.json`.

## MCP server configuration (mcp.json)

When an app uses remote MCP servers, add `mcp.json` to the root of the function app project. The runtime discovers remote HTTP or streamable HTTP MCP servers from this file and makes their tools available to agents, subject to any per-agent filters.

### Server entry fields

Use these fields in each `servers` entry:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | String | No | Use `http` or `streamable-http`. Defaults to `http` when a URL is supplied. The runtime doesn't support local `stdio` MCP servers. |
| `url` | String | Yes | Remote MCP server endpoint. Environment variable substitution is supported. |
| `headers` | Object | No | Static headers for a generic remote MCP server. Don't store static secrets in `mcp.json`. |
| `auth.scope` | String | When using Microsoft Entra authentication | Microsoft Entra token scope used to authenticate calls to the MCP server. |
| `auth.client_id` | String | No | Client ID of the managed identity used to authenticate with this MCP server. Falls back to `AZURE_CLIENT_ID`, then the default credential chain. |
| `tools` | Array of strings | No | Exact tool names to expose from this server. Omit it, or include `"*"`, to expose all tools. Use `[]` to expose none. Wildcard patterns such as `search_*` aren't supported. |

If an entry has a missing, empty, or unresolved `url`, the runtime skips it and logs a warning. Per-agent `mcp.exclude` filters server names, not individual tools. Use the server entry's `tools` field to select tools.

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

The `auth.client_id` setting selects which managed identity authenticates with the MCP server. Set it to the client ID of a user-assigned managed identity, or omit it to use the [identity fallback](#managed-identity-configuration). The selected identity, or your local developer identity when you run locally, must be allowed to call the MCP server.

## Azure connectors

A [Connector Namespace](../connector-namespace/connector-namespace-overview.md) hosts connections, triggers, and MCP servers. Use `trigger.type: connector_trigger` for connector-triggered agents, and add connector MCP server URLs and authentication settings to [`mcp.json`](#mcp-server-configuration-mcpjson) for outbound actions.

For provisioning, authorization, and development examples, see [Use connectors in Azure Functions](functions-connectors-overview.md) and the [hosted skills developer guide](functions-hosted-skills-developer-guide.md).

## Skills

Store reusable prompt assets under `skills/`. They help keep the base agent instructions small while making domain-specific instructions available when needed. The runtime uses the [Agent Skills](https://agentskills.io/) format.

### Skill format

The runtime scans `skills/` or `Skills/` in the function app project root through two child directory levels. It checks the root itself, direct child folders, and their child folders for `SKILL.md`. Scanning stops at each skill root: a nested `SKILL.md` beneath an already discovered skill is supporting content, not a separate selectable skill.

```text
skills/
  incident-response/
    SKILL.md
    triage-checklist.md
    escalation-policy.md
```

The `SKILL.md` file contains YAML front matter and Markdown instructions.

```markdown
---
name: incident-response
description: Triage production incidents, summarize impact, and recommend next steps. Use when the task mentions incidents, outages, alerts, or severity levels.
---

Follow the incident response checklist in [triage-checklist.md](triage-checklist.md).
```

### Authoring rules

The runtime discovers skill directories without parsing their front matter. The model SDK validates and loads their contents. For the default Microsoft Agent Framework SDK, follow these rules:

+ Every skill folder must contain a `SKILL.md` file.
+ The `name` and `description` fields are required.
+ Use lowercase letters, numbers, and single hyphens for skill names. Don't use spaces, underscores, uppercase letters, leading hyphens, trailing hyphens, or repeated hyphens.
+ The skill name must match its directory name. Use unique names across the app; duplicate-name handling belongs to the SDK, not runtime discovery.
+ The description should explain what the skill does and when to use it. The SDK exposes skill metadata before loading full instructions.
+ Skills can include supporting resources, assets, and scripts, not only Markdown. Reference supporting files from `SKILL.md` with relative paths. The default SDK provides helpers for loading skills, reading resources, and running skill scripts.

Only include trusted skill content. Skill script execution isn't the [Azure Container Apps sandbox](#sandboxed-execution). Use sandboxed execution when code requires that isolation, and custom Python tools for app-specific logic.

### Filtering skills per agent

Agents inherit all discovered skills by default. Exclusions match the basename of the directory containing `SKILL.md`, not a front-matter name parsed by the runtime. Disable or exclude skills in an agent file when a specific agent shouldn't use them:

```yaml
skills: false
```

```yaml
skills:
  exclude:
    - incident-response
```

## Sandboxed execution

For Python code execution, the runtime can use [Azure Container Apps dynamic sessions](../container-apps/sessions.md). Dynamic sessions provide isolated environments from [session pools](../container-apps/session-pool.md). The runtime uses [code interpreter sessions](../container-apps/sessions-code-interpreter.md) to provide an `fhs_execute_python` tool to agents.

### Configuration

Configure sandboxed execution in `agents.config.yaml`:

```yaml
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: $ACA_SESSION_POOL_ENDPOINT
```

### Requirements

+ The session pool must be a Python code interpreter session pool, such as a pool created with `--container-type PythonLTS`.
+ Set `endpoint` to a resolved HTTPS session pool management URL with a hostname ending in `.dynamicsessions.io`. Don't include user credentials in the URL.
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

Setting `tools: false` also disables sandboxed execution and the `web_request` system tool.

## Outbound HTTP requests

The runtime enables the `web_request` system tool by default. The tool makes outbound requests to public HTTP(S) hosts without generating sandbox code. Configure it app-wide in `agents.config.yaml`:

```yaml
system_tools:
  web_request:
    allowed_hosts:
      - learn.microsoft.com
    require_https: true
    timeout_seconds: 30
    max_response_bytes: 5000000
    max_request_bytes: 1000000
```

| Field | Type | Default | Limit or behavior |
| --- | --- | --- | --- |
| `allowed_hosts` | Array of strings or `null` | Any public host | Exact hostname matching, case-insensitive after normalization. No wildcard patterns. `[]` blocks all hosts. |
| `require_https` | Boolean | `true` | Set to `false` to also allow HTTP. Private and internal addresses remain blocked. |
| `timeout_seconds` | Number | `30` | Clamped to 0.1 through 120 seconds per request. |
| `max_response_bytes` | Integer | `5000000` | Clamped to 1 through 10,000,000 bytes. Larger response bodies are truncated. |
| `max_request_bytes` | Integer | `1000000` | Clamped to 1 through 10,000,000 bytes. Larger request bodies are rejected. |

Set `system_tools.web_request: false` in app-wide configuration to disable the tool for every agent, or in agent front matter to disable it for that agent. Agent front matter accepts only a Boolean override, not a limits object. `tools: false` also disables it.

### Tool request and response

| Request parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | String | Yes | Absolute HTTP(S) URL without embedded user credentials. |
| `method` | String | No | Defaults to `GET`. Supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. |
| `headers` | Object | No | Additional request headers. Transport and routing headers such as `Host` and `Content-Length` are removed. |
| `query` | Object | No | String-valued query parameters appended to the URL's query string. |
| `body` | String | No | Raw request body. Mutually exclusive with `json`. |
| `json` | JSON value | No | JSON request body. Sets `Content-Type: application/json`. |

The tool returns a JSON-encoded result with `status`, `url`, `content_type`, `redirect_count`, `response_headers`, `body`, `body_truncated`, and `body_omitted_reason`. It parses JSON response bodies when possible and returns text as text. It doesn't return binary bodies; `response_bytes` reports their size. The tool removes sensitive response headers, including cookies and authentication headers.

The tool doesn't follow redirects. It returns HTTP error statuses and redirects as responses, not transport errors. If a request fails because of a blocked destination, a request-size limit, a timeout, or a transport failure, the result includes an `error` field. Public-address validation and DNS address pinning always apply, regardless of the configured allowlist.

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

During discovery, the runtime selects decorated tools before plain functions. Define plain functions in the tool module rather than importing them from another module. The runtime loads files during discovery, so module-level code runs in the function app process. If an import fails, the runtime logs the failure and doesn't register the tool from that file.

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

The runtime supports Azure OpenAI, Microsoft Foundry, and OpenAI model providers.

### Provider selection

You must configure at least one provider signal for the runtime to create a chat client. You can explicitly set the provider by using the `AZURE_FUNCTIONS_AGENTS_PROVIDER` setting or let the runtime infer the provider from your other app settings.

Use these provider settings:

| Provider | `AZURE_FUNCTIONS_AGENTS_PROVIDER` value | Required settings | Optional settings | Model setting behavior |
| --- | --- | --- | --- | --- |
| Microsoft Foundry | `foundry` | `FOUNDRY_PROJECT_ENDPOINT` | `AZURE_CLIENT_ID` when you want a user-assigned managed identity | Use `FOUNDRY_MODEL` for the deployment name unless a higher-priority model setting supplies it. |
| Azure OpenAI | `azure_openai` | `AZURE_OPENAI_ENDPOINT` | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_API_VERSION`, `AZURE_CLIENT_ID` when you want a user-assigned managed identity | Use `AZURE_OPENAI_DEPLOYMENT` for the deployment name unless a higher-priority model setting supplies it. |
| OpenAI | `openai` | `OPENAI_API_KEY` | None | Set `AZURE_FUNCTIONS_AGENTS_MODEL` to the OpenAI model name when you don't pass a model in agent or runtime configuration. |

When you don't set `AZURE_FUNCTIONS_AGENTS_PROVIDER`, the runtime auto-detects the provider in this order:

1. `AZURE_OPENAI_ENDPOINT` selects Azure OpenAI.
1. `FOUNDRY_PROJECT_ENDPOINT` selects Microsoft Foundry.
1. `OPENAI_API_KEY` selects OpenAI.

Provider selection and model selection are separate. Always supply a valid model or deployment name through one of the settings below; auto-detecting a provider doesn't verify that the selected deployment exists.

`AZURE_FUNCTIONS_AGENTS_MODEL` is a runtime-wide model setting. Its valid values depend on the active provider:

+ For Microsoft Foundry, use a model deployment name that exists in the Foundry project.
+ For Azure OpenAI, use an Azure OpenAI deployment name. This setting takes precedence over `AZURE_OPENAI_DEPLOYMENT` for agents loaded from configuration.
+ For OpenAI, use the model name accepted by the OpenAI API, such as `gpt-4o-mini`.

### Model precedence

For agents loaded from agent files, model selection follows this order:

1. `model` in agent front matter.
1. `model` in `agents.config.yaml`.
1. `AZURE_FUNCTIONS_AGENTS_MODEL`.
1. Provider-specific settings, such as `AZURE_OPENAI_DEPLOYMENT` or `FOUNDRY_MODEL`.
1. The built-in fallback, `gpt-4o-mini`.

For Azure providers, the selected value must identify an existing deployment. The fallback doesn't create a deployment, so explicitly configure the model rather than relying on it.

### Runtime app settings

In addition to provider and identity settings, the runtime recognizes:

| App setting | Default | Description |
| --- | --- | --- |
| `AZURE_FUNCTIONS_AGENTS_MODEL` | Provider setting, then `gpt-4o-mini` | Runtime-wide model or deployment name. |
| `AZURE_FUNCTIONS_AGENTS_TIMEOUT_SECONDS` | `900` | Execution timeout in seconds when neither front matter nor app-wide configuration sets it. |
| `AZURE_FUNCTIONS_AGENTS_REASONING_EFFORT` | Unset | Reasoning effort passed to the model SDK. Use only values supported by the selected model. |
| `AZURE_FUNCTIONS_AGENTS_REASONING_SUMMARY` | Unset | Reasoning summary option passed to the model SDK. Use only when supported by the selected model. |
| `AZURE_FUNCTIONS_AGENTS_SESSION_CONTAINER` | `azure-functions-agents` | Blob container for session history. |

Reasoning settings don't enable reasoning on a model that doesn't support it. Execution timeout doesn't override Azure Functions hosting limits or the HTTP response timeout.

## Managed identity configuration

The runtime uses managed identities when connecting to Azure resources that support Microsoft Entra authentication. Use `AZURE_CLIENT_ID` as the app's default identity selector, or use feature-specific settings for finer control:

| Runtime feature | Identity setting | Fallback<sup>1</sup> |
| --- | --- | --- |
| Azure OpenAI model provider<sup>2</sup> | `AZURE_CLIENT_ID` | `DefaultAzureCredential` |
| Microsoft Foundry model provider | `AZURE_CLIENT_ID` | `DefaultAzureCredential` |
| Azure Container Apps dynamic sessions sandbox | `system_tools.dynamic_sessions_code_interpreter.client_id` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |
| MCP servers hosted in connector namespaces | The `auth.client_id` value in the server entry in `mcp.json` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |
| Blob-backed session history<sup>3</sup> | `AzureWebJobsStorage__clientId` | `AZURE_CLIENT_ID`, then `DefaultAzureCredential` |

1. When you don't configure an identity setting, the runtime uses [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential), which resolves to the system-assigned managed identity in Azure and your developer identity (Azure CLI or Visual Studio) locally.
1. When you configure an API key in Azure OpenAI (using `AZURE_OPENAI_API_KEY`), the model provider uses the key instead of a managed identity. For more information about SDK authentication with API keys or Microsoft Entra ID, see [Azure OpenAI v1 API authentication](/azure/foundry/openai/api-version-lifecycle#code-changes).
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

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `debug_chat_ui` | Boolean | `false` | Enables the HTML chat page and the backing chat, streaming, and history APIs. |
| `chat_api` | Boolean | `false` | Enables chat, streaming, and history APIs without requiring the debug UI. |
| `mcp` | Boolean | `false` | Exposes the agent as an MCP tool named after its identity slug on the shared MCP extension endpoint. |
| `http_auth` | String or object | App-wide policy, then `function` | [Authentication policy](#http-authentication) for built-in HTTP APIs; doesn't apply to MCP. |

### Endpoint routes

The `<AGENT_NAME>` route segment is the agent's [identity slug](#agent-file-reference), not its display `name`. For example, `main.agent.md` uses `agents/main/`.

The following HTTP routes are relative to the `extensions.http.routePrefix` setting in `host.json`. The Functions default is `api`, so `agents/main/chat` is normally `/api/agents/main/chat`. Set `routePrefix` to an empty string to use `/agents/main/chat`. The MCP extension webhook isn't affected by that prefix.

| Surface | Route | Authentication |
| --- | --- | --- |
| Chat UI | `GET agents/<AGENT_NAME>/` | HTML page is anonymous at the Functions key layer; backing APIs enforce `http_auth`. |
| HTTP chat API | `POST agents/<AGENT_NAME>/chat` | Resolved `builtin_endpoints.http_auth`; function key by default. |
| Streaming chat API | `POST agents/<AGENT_NAME>/chatstream` | Resolved `builtin_endpoints.http_auth`; function key by default. |
| Session history | `GET agents/<AGENT_NAME>/history` | Same policy as chat APIs. The runtime registers this route when you enable `chat_api`. |
| MCP endpoint | `/runtime/webhooks/mcp` | `mcp_extension` system key. |

Workflow-enabled agents also register workflow status routes when `chat_api` is enabled. For workflow behavior, see [Dynamic workflows](functions-hosted-skills-dynamic-workflows.md).

### Retrieving keys

Use [`az functionapp keys list`](/cli/azure/functionapp/keys#az-functionapp-keys-list) to retrieve host keys. `functionKeys.default` is the default host function key, `masterKey` is the master key for `admin` mode, and `systemKeys.mcp_extension` is the MCP extension's system key. Supply a key in the `x-functions-key` header or the `code` query parameter. Keys aren't a substitute for Entra authentication.

For key retrieval and local development steps, see the [developer guide](functions-hosted-skills-developer-guide.md).

### Chat API request flow

Both built-in chat APIs expect a JSON object with a `prompt` field. Set `prompt` to a string that isn't empty or only whitespace:

```json
{
  "prompt": "Summarize today's failures."
}
```

Use `POST agents/<AGENT_NAME>/chat` for one JSON response. The response body includes `session_id`, `response`, `model`, and `tool_calls`. For a resumable session, the runtime also returns its ID in the `x-ms-session-id` response header.

The API returns `400` for invalid JSON or an invalid prompt. The prompt must be a string that isn't empty or only whitespace. Chat errors include an `error` field. Storage errors return `503`, and other execution failures return `500`.

Use `POST agents/<AGENT_NAME>/chatstream` for Server-Sent Events (SSE). Each event is a `data:` frame containing JSON with a `type` discriminator, not a named SSE `event:` frame:

```text
data: {"type": "session", "session_id": "<SESSION_ID>"}

data: {"type": "delta", "content": "Summary text"}

data: {"type": "done"}

```

| `type` | Additional fields | Meaning |
| --- | --- | --- |
| `session` | `session_id` | Session ID for subsequent requests. |
| `delta` | `content` | Incremental response text. |
| `message` | `content` | Complete message text when emitted by the SDK. |
| `intermediate` | `content` | Intermediate text before the final response. |
| `tool_start` | `tool_call_id`, `tool_name`, `arguments` | A tool call started. |
| `tool_end` | `tool_call_id`, `tool_name`, `result` | A tool call completed. |
| `stream_truncated` | `dropped_events` | The stream dropped events. |
| `done` | None | Successful completion. |
| `error` | `content` | Failure details; the client must treat the stream as failed. |

Event availability depends on the SDK and execution. Clients must handle `error` even before a `session` event, and shouldn't infer success from HTTP `200` alone.

To continue a multiturn conversation, send the returned session ID in the `x-ms-session-id` request header on later `chat` or `chatstream` calls. If you omit the header, the runtime starts a new session. Session IDs must match `^[A-Za-z0-9._-]{1,128}$`. The runtime rejects invalid IDs rather than using them as storage paths.

```http
POST /api/agents/main/chatstream HTTP/1.1
Content-Type: application/json
Accept: text/event-stream
x-ms-session-id: <SESSION_ID_FROM_A_PREVIOUS_RESPONSE>

{"prompt":"Continue the last summary and add blockers."}
```

### Session history API

Send `GET agents/<AGENT_NAME>/history` with the `x-ms-session-id` header to retrieve a stored transcript. The response contains `messages` and a `truncated` Boolean. If you omit the session ID, the API returns `{"messages": [], "truncated": false}`. If you supply an invalid ID, it returns `400`. If the selected SDK doesn't support history retrieval, the endpoint returns `501`. The API reports history-loading failures as errors, not as a successful empty transcript.

## Sessions and state

Multi-turn agent interactions require session history. The default Microsoft Agent Framework SDK chooses storage from configuration, not from whether the app runs locally or in Azure:

| Configuration | Storage | Behavior |
| --- | --- | --- |
| `AzureWebJobsStorage` is set | Blob Storage through the connection string | Takes precedence over `AzureWebJobsStorage__blobServiceUri`. Local development storage, including Azurite, also selects this backend. |
| Only `AzureWebJobsStorage__blobServiceUri` is set | Blob Storage with Microsoft Entra authentication | Identity selection is `AzureWebJobsStorage__clientId`, then `AZURE_CLIENT_ID`, then the default credential chain. |
| Neither storage setting is set | Local JSONL files | Stored under `<config_dir>/agent-sessions/<AGENT_NAME>/<SESSION_ID>.jsonl`. |

Blob history uses the `azure-functions-agents` container by default. Override the container name with `AZURE_FUNCTIONS_AGENTS_SESSION_CONTAINER`. History is scoped by agent identity slug and session ID. If configured Blob storage fails, the runtime reports the failure rather than silently switching to local files.

The runtime doesn't require a separate session database. [Sandboxed execution](#sandboxed-execution) is also session-aware: when no explicit session ID is available, the runtime uses a fresh isolated sandbox session so unrelated invocations don't share state.

## Supported hosting plans

Azure Functions hosted skills support these Azure Functions hosting plans:

+ [Flex Consumption](flex-consumption-plan.md)
+ [Premium](functions-premium-plan.md)
+ [Dedicated (App Service)](dedicated-plan.md)

For scaling, networking, and timeout limits, see [Azure Functions hosting options](functions-scale.md). Runtime configuration doesn't override hosting-plan limits.

## Related content

+ [Azure Functions hosted skills](functions-hosted-skills.md)
+ [Build an event-driven AI app using Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Flex Consumption plan hosting](flex-consumption-plan.md)
