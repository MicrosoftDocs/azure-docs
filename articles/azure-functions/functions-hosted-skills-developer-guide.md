---
title: Azure Functions hosted skills developer guide
description: "Learn how to define hosted skills in Markdown, configure triggers, connect MCP servers, reuse skills, and add Python tools in Azure Functions."
ms.topic: article
ms.date: 11/06/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - ignite-2026
ms.collection:
  - ce-skilling-ai-copilot
#Customer intent: As a developer, I want to write hosted skills and configure their tools and triggers so that I can build an event-driven AI app.
---

# Azure Functions hosted skills developer guide

Azure Functions hosted skills use a Markdown-first programming model on the Azure Functions Python runtime. You define each hosted skill in an `.agent.md` file. YAML front matter sets its configuration. The Markdown body gives instructions to the model.

Most development work changes these definitions and their tool and configuration files. You usually don't need to change the generated Functions startup code. However, the app still needs the correct host settings, Python dependencies, model access, and service permissions.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

This guide uses the public preview package `azurefunctions-agents-runtime`. For a complete local setup, start with the [canvas quickstart](functions-hosted-skills-canvas.md). To create Azure resources and deploy a sample, use the [Azure Developer CLI quickstart](scenario-hosted-skills.md).

> [!NOTE]
> An `.agent.md` file defines a *hosted skill*, which can run when an event occurs. A `SKILL.md` file defines a *reusable skill*, which supplies instructions and reference material to a hosted skill. These files have different purposes.

## Project structure

Use the following structure in the function app project root. Add the optional files only when your app needs them.

```text
<project_root>/
├── function_app.py
├── host.json
├── requirements.txt
├── local.settings.json
├── summarize.agent.md
├── agents.config.yaml
├── mcp.json
├── skills/
│   └── report-writing/
│       ├── SKILL.md
│       ├── references/
│       │   └── report-format.md
│       └── assets/
│           └── example-report.md
└── tools/
    └── get_policy.py
```

| File or folder | Purpose |
| --- | --- |
| `function_app.py` | Creates the Functions app and starts runtime discovery. |
| `host.json` | Sets Azure Functions host options, such as extension bundles and the function timeout. |
| `requirements.txt` | Lists the hosted skills runtime and other Python dependencies. |
| `local.settings.json` | Holds local app settings. Don't commit secrets in this file. |
| `summarize.agent.md` | Defines one hosted skill, its trigger, and its instructions. |
| `agents.config.yaml` | Optional app-wide runtime defaults. |
| `mcp.json` | Optional remote MCP server definitions. |
| `skills/` | Optional reusable skills and their Markdown resources. |
| `tools/` | Optional custom Python tools. |

The startup code in `function_app.py` can be as small as this:

```python
from azure_functions_agents import create_function_app

app = create_function_app()
```

The runtime discovers hosted skills and their configured capabilities when the Functions host loads the app. Keep the host and dependency files from your starter project. For the standard Python app files, see the [Python developer guide](functions-reference-python.md#folder-structure).

## Define a hosted skill

Create `summarize.agent.md` in the project root:

````markdown
---
name: Request summary
description: Summarize a request and identify missing information.
trigger:
  type: http_trigger
  args:
    route: summarize
    methods: [POST]
    http_auth: function
builtin_endpoints:
  debug_chat_ui: true
  http_auth: function
---

Summarize the request supplied in the HTTP request body.

Return these sections:

- Summary: State the purpose of the request.
- Missing information: List the facts needed to complete the request.
- Questions: Ask specific questions for the missing facts.

Use only the supplied facts. Do not invent names, dates, or approvals.
If the request is empty or unclear, explain what information is needed.
````

This definition accepts HTTP POST requests on the `summarize` route. In Azure, `http_auth: function` requires a function or host key. The standard Functions route prefix is `api`, so the route is normally `/api/summarize`. Don't use a local test to confirm deployed authentication. For details, see [HTTP trigger authorization](functions-bindings-http-webhook-trigger.md#http-auth).

The file name supplies the hosted skill's identity. For `summarize.agent.md`, the generated Azure Function name is `summarize`, and the built-in endpoint route segment is `summarize`. The `name` field is a display name. A change to that field doesn't rename the function. An explicit HTTP `route`, as in this example, sets the HTTP trigger route.

The `builtin_endpoints` block enables the chat window and its backing chat APIs for local testing. For available endpoints and authentication settings, see [built-in endpoints](functions-hosted-skills-reference.md#built-in-endpoints).

### Write clear instructions

State the goal, the input, the tools to use, and the required output. Explain what to do when data is missing or a tool fails. State which actions the hosted skill must not take.

Instructions aren't authorization controls. Validate exact business rules, permissions, and required approvals in code or in the service that performs the action. For example, a prompt that says "send only approved reports" doesn't replace an approval check in the tool that sends the report.

### Configure shared defaults and overrides

Set shared model and timeout defaults in `agents.config.yaml`:

```yaml
model: $FOUNDRY_MODEL
timeout: 900
```

Set `FOUNDRY_MODEL` to a model deployment available through your configured provider. For a complete Foundry app settings example, see [Configure local settings](#configure-local-settings). For other providers, see [model provider configuration](functions-hosted-skills-reference.md#model-provider-configuration).

Add supported overrides for defaults defined in `agents.config.yaml` to the front matter when the hosted skill needs different settings:

```yaml
timeout: 120
mcp:
  exclude:
    - office365-outlook
skills: false
```

This example sets a 120-second runtime timeout, removes one MCP server, and disables reusable skills for this hosted skill. The excluded server name must match a key in `mcp.json`.

Use `$SETTING_NAME` to insert an app setting into a supported string value. For example, `model: $FOUNDRY_MODEL` reads the model setting. This syntax isn't full shell expression syntax. For substitution rules, see [variable substitution](functions-hosted-skills-reference.md#variable-substitution).

## Set a trigger

Use one explicit trigger in each `.agent.md` file that starts with an event. To process Azure Storage Queue messages instead of HTTP requests, replace the `trigger` block:

```yaml
trigger:
  type: queue_trigger
  args:
    queue_name: work-items
    connection: AzureWebJobsStorage
```

Also change the instructions to describe the queue message input instead of an HTTP request body.

The `connection` value is an app setting name or the prefix for an identity-based setting collection, not an embedded secret. Configure the storage connection and permissions separately. For more information, see [Queue trigger connections](functions-bindings-storage-queue-trigger.md#connections).

Choose a trigger for the event source:

| Event source | Use |
| --- | --- |
| HTTP request | `http_trigger` for a request and response. |
| Schedule | `timer_trigger` with a timer schedule. |
| Queue or Service Bus | A queue or message trigger for work items. |
| Blob or database change | The trigger for the storage or database service. |
| External service event | `connector_trigger` with a configured connector event source. |

For the full list and required arguments, see [supported trigger types](functions-hosted-skills-reference.md#supported-trigger-types).

Optional built-in chat and MCP endpoints are separate from the explicit trigger. See [built-in endpoints](functions-hosted-skills-reference.md#built-in-endpoints) for more information. A remote MCP server definition in `mcp.json` doesn't expose your hosted skill as an MCP server.

## Connect an MCP server

Use a remote MCP server when another service already supplies the tools that you need. Add `mcp.json` to the function app project root:

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

The runtime supports remote `http` and `streamable-http` transports. It doesn't start local `stdio` or command-based MCP servers.

Hosted skills inherit discovered MCP servers unless you exclude them. To exclude the server from a hosted skill, define `mcp.exclude` in the `.agent.md` file. To limit a server to specific tools, add a `tools` array to its entry in `mcp.json`. Use the exact tool names published by that server. This selection applies to the server definition.

For Microsoft Entra authentication, set `auth.scope` to the server's token scope. You can also set `auth.client_id` to select a user-assigned managed identity. The selected identity must have permission to call the server. Don't put secrets in `mcp.json`. For details, see [MCP server configuration](functions-hosted-skills-reference.md#mcp-server-configuration-mcpjson).

Hosted execution is noninteractive. This identity-based configuration doesn't automatically perform an interactive user OAuth flow. If a business service requires delegated user authorization, consider a supported connector and its managed connection. Confirm that the connector supports the service's required authorization model. See [Use Azure connectors](#use-azure-connectors).

## Reuse instructions with skills

Use a reusable skill for guidance that several hosted skills need, or for reference material that isn't needed on every request.

Create `skills/report-writing/SKILL.md`:

````markdown
---
name: report-writing
description: Write a review report from supplied facts. Use when a task requests a review report.
---

Read [the report format](references/report-format.md) before you write.
Use [the example report](assets/example-report.md) as a format example,
not as a source of facts.

State the result, the supporting facts, and the questions that remain.
If required facts are missing, list them. Do not invent a result.
````

In `references/report-format.md`, define the required report sections. In `assets/example-report.md`, give a sample report that shows the format.

The skill's `name` must match its containing directory, such as `report-writing`. The runtime supplies skill names and descriptions for discovery and loads full instructions and resources on demand. Mention supporting resources in `SKILL.md` so that the hosted skill knows when to read them.

Keep each skill in its own folder directly under `skills/`. For authoring guidelines, see [Skills](functions-hosted-skills-reference.md#skills).

Skill files don't automatically register executable tools. Use a configured tool for executable behavior. Don't assume that a script in a skill gives the model permission or a way to run it.

## Add tools

First, use a remote MCP tool or a runtime system tool if it meets the requirement. Add custom Python tools for app-specific logic.

### Runtime system tools

The runtime enables the `web_request` system tool by default. It makes outbound requests to public web addresses. HTTPS is required by default. To restrict requests to an exact hostname, add this configuration to `agents.config.yaml`:

```yaml
system_tools:
  web_request:
    allowed_hosts:
      - example.com
```

Set `system_tools.web_request: false` to disable the tool app-wide or for one hosted skill. An allow list restricts destinations. It doesn't grant permission to use a service or send confidential data.

For isolated Python execution, configure an [Azure Container Apps dynamic sessions](../container-apps/sessions.md) Python code interpreter pool:

```yaml
system_tools:
  dynamic_sessions_code_interpreter:
    endpoint: $ACA_SESSION_POOL_ENDPOINT
```

Set `ACA_SESSION_POOL_ENDPOINT` to the pool's management endpoint. Grant the app identity the required pool permissions before use. For identity settings and requirements, see [sandboxed execution](functions-hosted-skills-reference.md#sandboxed-execution).

### Custom Python tools

Create `tools/get_policy.py`:

```python
from azure_functions_agents import tool


@tool
def get_policy_version() -> str:
    """Return the version of the sample review policy."""
    return "2026-10"
```

Use one public tool per `.py` file under `tools/`. The runtime registers the first supported ordinary tool that it finds in each file. Use type hints and a clear docstring so that the model can understand the tool's purpose and inputs. Add any required packages to `requirements.txt`.

A custom Python tool runs in the Functions Python worker. It's not automatically isolated in a sandbox. Validate inputs, enforce permissions, and report failures explicitly. For tools that change external state, make repeated calls safe, for example by using an idempotency key.

Durable workflow tools use a separate `@workflow_tool` contract. For that model, see [Dynamic workflows](functions-hosted-skills-dynamic-workflows.md).

## Manage configuration

Local settings aren't automatically copied to Azure app settings. Configure both environments. Keep secrets out of Git, use managed identity where supported, and use appropriate secret storage for credentials that are still required. See [local settings](functions-develop-local.md#local-settings-file) and [manage app settings](functions-how-to-use-azure-function-app-settings.md#settings).

The hosted skill's `timeout` and the Functions host's `functionTimeout` are separate limits. Set both for your workload. A hosted skill timeout doesn't override hosting plan limits or HTTP response limits. See [function app timeout duration](functions-scale.md#timeout).

## Use Azure connectors

Azure connectors let hosted skills call authorized external operations and receive service events without custom client and authentication code. This section assumes that the connector resources already exist.

To set up an MCP server and its connection, see [Create an MCP server connector](../connector-namespace/create-mcp-server-connectors.md).

For an existing Microsoft 365 Outlook MCP server, add an entry to `mcp.json`:

```json
{
  "servers": {
    "office365-outlook": {
      "type": "http",
      "url": "$O365_MCP_SERVER_URL",
      "auth": {
        "scope": "https://apihub.azure.com/.default"
      }
    }
  }
}
```

Set `O365_MCP_SERVER_URL` to the deployed server endpoint in local or Azure app settings. Grant the function app's identity access to that MCP server. To select a user-assigned managed identity, add `auth.client_id` with its client ID.

Configure both authorization boundaries:

| Boundary | Required configuration |
| --- | --- |
| Function app to connector MCP server | The app identity needs permission to call the MCP server. |
| Connector connection to external service | The connection must be authorized for the upstream user or service and the required operations. |

Permission at one boundary doesn't grant permission at the other. The connection's authorization doesn't automatically become the identity of each caller of your hosted skill.

To start a hosted skill from a connector event, first [create and authorize a connection](../connector-namespace/create-connector-namespace-connection.md). Then use this trigger block in its `.agent.md` file:

```yaml
trigger:
  type: connector_trigger
```

You must also configure the upstream event, callback routing, and callback authentication in the Connector Namespace. A server definition in `mcp.json` doesn't subscribe to events. For extension requirements and event setup, see [Use managed connectors in Azure Functions](functions-connectors-overview.md#connector-based-triggers).

## Run locally

Use [Azure Functions Core Tools](functions-run-local.md) to start the app on your computer. You also need Python 3.13 or later and access to a model deployment.

### Configure local settings

Create `local.settings.json` in the function app project root. For a Foundry model and local Azure Storage, use this structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "AZURE_FUNCTIONS_AGENTS_PROVIDER": "foundry",
    "FOUNDRY_PROJECT_ENDPOINT": "https://<resource-name>.services.ai.azure.com/api/projects/<project-name>",
    "FOUNDRY_MODEL": "<model-deployment-name>"
  }
}
```

Replace the endpoint and model placeholders with your deployment values. Use a model deployment that exists in your Foundry project and grant your local developer identity access to it. Add any settings used by your MCP servers, tools, or triggers. Keep `local.settings.json` out of source control.

Use an emulator for a data source when a compatible emulator is available. For example, [Azurite](../storage/common/storage-use-azurite.md) supplies local Blob, Queue, and Table storage. Start Azurite before the Functions host when you use `UseDevelopmentStorage=true`. For Service Bus, see the [Service Bus emulator](../service-bus-messaging/overview-emulator.md).

Connector namespaces, connections, and connector MCP servers require actual Azure resources. Local execution still calls those resources. Model calls and Azure Container Apps dynamic sessions also use their configured services and can incur charges.

### Start the Functions host

Create and activate a Python virtual environment as described in the [Python local development guide](functions-run-local.md). In the function app project root, install the packages from `requirements.txt`:

```console
python -m pip install -r requirements.txt
```

For Foundry with identity-based access, sign in with an identity that has permission to use the model:

```azurecli
az login
```

Start the host from the same directory:

```console
func start
```

The host lists the `summarize` function and the built-in endpoints enabled by the example. With the default `api` route prefix and port `7071`, the output is similar to:

```output
Functions:

    agent_summarize_builtin_chat: [POST] http://localhost:7071/api/agents/summarize/chat

    agent_summarize_builtin_chatstream: [POST] http://localhost:7071/api/agents/summarize/chatstream

    agent_summarize_builtin_chat_page: [GET] http://localhost:7071/api/agents/summarize/

    agent_summarize_builtin_history: [GET] http://localhost:7071/api/agents/summarize/history

    summarize: [POST] http://localhost:7071/api/summarize
```

Keep the host running while you test. Read the terminal output for configuration errors and the registered function URLs. For more information, see [Run a local function](functions-run-local.md#run-a-local-function).

### Test with the chat window

The `summarize.agent.md` example already enables the built-in chat window and its backing chat APIs.

Open `http://localhost:7071/api/agents/summarize/` in your browser when `host.json` uses the default `api` route prefix. If your starter project sets `extensions.http.routePrefix` to an empty string, use `http://localhost:7071/agents/summarize/` instead. Use the actual host port if it differs from `7071`.

Enter a sample request, send it, and inspect the response and host log. For example, ask the hosted skill to summarize a request with a missing delivery date. Check that the response identifies the missing date instead of inventing one. Also test missing input and tool failures.

Local Core Tools execution normally skips function-key checks. Keep `http_auth: function` in the definition and test authentication separately in Azure. For a deployed chat window, supply the function key when prompted. Enable debug endpoints only where needed. For routes and key retrieval, see [built-in endpoints](functions-hosted-skills-reference.md#built-in-endpoints).

## Deploy to Azure

Choose a deployment method for your project:

| Method | Guidance |
| --- | --- |
| Sample with a Bicep template | Use the [hosted skills sample repository](https://github.com/Azure-Samples/functions-quickstart-serverless-agents-azd). Its infrastructure template creates the required resources. Follow the [Azure Developer CLI quickstart](scenario-hosted-skills.md) to configure and run `azd up`. |
| Azure Functions Hosted Skills canvas | Use the canvas to create and test an app, then select **Deploy to Azure**. See the [hosted skills canvas quickstart](functions-hosted-skills-canvas.md). |
| Azure Functions Skills | Install [Azure Functions Skills](https://github.com/Azure/azure-functions-skills). Its [`azure-functions-hosted-skills` authoring skill](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-hosted-skills/SKILL.md) helps your coding agent create an app and prepare its deployment. Ask the coding agent to deploy the app, then review the proposed resources, permissions, and cost before you approve deployment. |

After deployment, confirm that Azure app settings contain the required values, the app identity has access to the model and tools, and each connector connection is authorized. Test the deployed trigger and its authentication with a controlled request before you use production data.

## Explore end-to-end samples

Use these samples to see how hosted skills combine triggers, tools, and Azure services in a complete app. Each repository includes setup and deployment instructions.

| Sample | What it demonstrates |
| --- | --- |
| [Insurance policy review](https://github.com/Azure-Samples/hosted-skills-dynamic-workflows-insurance-policy-review) | Start a durable workflow from a queue message, review documents in parallel, and save a report to Blob Storage for human review. |
| [Expense processor](https://github.com/Azure-Samples/hosted-skills-expense-processor) | Process expenses from a queue, read policy documents through a connector MCP server, and route results to output queues. Model calls use an Azure API Management AI gateway. |
| [Daily blog summary](https://github.com/Azure-Samples/functions-daily-blog-hosted-skills-azd) | Use chat and timer triggers to summarize blog posts with an Azure Container Apps dynamic sessions code interpreter. Optionally send the summary through a Microsoft 365 Outlook connector. |

## Related content

+ [Azure Functions hosted skills overview](functions-hosted-skills.md)
+ [Hosted skills configuration reference](functions-hosted-skills-reference.md)
+ [Build and test with the hosted skills canvas](functions-hosted-skills-canvas.md)
+ [Deploy an event-driven hosted skills app](scenario-hosted-skills.md)
+ [Build dynamic workflows](functions-hosted-skills-dynamic-workflows-how-to.md)
+ [Runtime observability guidance](https://github.com/Azure/azure-functions-agents-runtime/blob/main/docs/observability.md)
+ [Hosted skills samples](https://github.com/Azure/azure-functions-agents-runtime/tree/main/samples)
