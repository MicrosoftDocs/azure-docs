---
title: Move AI workloads to AI Gateway
titleSuffix: AI Gateway
description: Plan how to move existing AI model and tool traffic to AI Gateway for centralized access, governance, and visibility, including workloads in Azure API Management.
author: santiagxf
ms.author: fasantia
ms.reviewer: fasantia
ms.date: 10/25/2026
ms.topic: concept-article
ms.service: azure
---

# Move AI workloads to AI Gateway

[AI Gateway](./overview.md) helps platform teams give applications and agents shared, governed access to AI models and tools. You can bring existing AI traffic through AI Gateway to centralize connections, apply AI-focused controls, and gain visibility into usage. 

This article explains how you can move AI APIs in Azure API Management service to Azure AI Gateway.

## Map the workload to AI Gateway

Inventory the model connections and tools you plan to bring through AI Gateway, their callers, backend services, credentials, controls, networking, and operational dependencies. Use that inventory to design the target configuration.

| Existing configuration | Target design to assess |
| --- | --- |
| Direct model calls or model APIs behind a gateway | Model providers and registered models, with the required protocol, endpoint, and backend authentication |
| Client-facing model names | Model aliases that preserve the names applications use where possible |
| MCP servers or HTTP API operations exposed as tools | MCP backends and selected tools published through gateway MCP endpoints |
| Application credentials and caller authorization, including API Management subscriptions | Gateway runtime credentials or Microsoft Entra access grants for the required callers |
| Controls in applications or an existing gateway | Supported AI Gateway controls configured for the appropriate models, tools, and callers |
| Consumption limits and caller grouping | Token-limit and cost-limit policies that meet the workload's allowance and estimated-spend requirements |
| Diagnostics, logs, and dashboards | Gateway telemetry, alerts, and dashboards that support equivalent operational checks |
| Deployment automation | Resource definitions and management operations for `Microsoft.ApiManagement/aigateways` |

Treat this mapping as a design assessment, not a direct configuration conversion. For workloads in API Management, APIs, products, subscriptions, and policies need to be mapped to AI Gateway's model- and tool-centered configuration. A token quota and an estimated monetary budget serve different purposes; neither replaces provider billing.

## Use the AI Gateway plugin to assess and migrate

The AI Gateway plugin performs the identification described in the previous section and carries it through to provisioning. It works in four steps: **inventory** the objects in the source instance, **plan** the gateway objects that represent them, **adapt** the plan where capabilities differ, and **provision** the result. Each step is distinct.

### Prerequisites

- An Azure API Management instance that publishes AI workloads: model APIs, Model Context Protocol (MCP) servers, or agent-to-agent (A2A) agents.
- The **Reader** role on the API Management instance, and the **Reader** role on any Azure AI Foundry or Azure OpenAI account that you want resolved to its deployments.
- Permission to create resources in the target resource group, and permission to assign roles if your workload uses managed identity to reach its model backends.
- [Azure CLI](/cli/azure/install-azure-cli) 2.75.0 or later, signed in with `az login`, and the `az aigateway` extension. For installation steps, see the [AI Gateway CLI guide](https://github.com/Azure/aigateway/blob/main/cli/README.md).
- Python 3.10 or later, which the migration tool runs on.
- A coding agent with the AI Gateway plugin installed: GitHub Copilot CLI, Claude Code, Cursor, or Gemini CLI. For installation steps, see [Coding-agent plugin](https://github.com/Azure/aigateway#coding-agent-plugin).

### How the plugin works

The plugin adds a `migrate-apim` skill and an `/aigateway:migrate` command to your coding agent, and it ships the migration tool that does the reading and writing. The tool is a dependency-free Python package, so there's nothing else to install, and it reads Azure Resource Manager with your Azure CLI sign-in.

Start your agent in a working folder and run the command with the source instance:

```text
/aigateway:migrate <apim-name> <resource-group>
```

The agent drives a pipeline of files rather than a single command, because a migration needs your decisions in the middle of it:

| Artifact | Produced by | Edited | Contains |
|---|---|---|---|
| `inventory.json` | `collect` | No | What API Management holds, plus resolved Azure deployments |
| `plan.json` | `plan` | Yes, in place | One item per source aspect: the proposal, the options, the evidence, and pre-shaped target objects |
| `journal.json` | `apply` | No | Attempts and resume state |

Three properties of the workflow are worth knowing before you start:

- **The plan is the record.** Every decision lives on the item it settles, so a later session continues by pointing at the same file. Re-running `plan` preserves your decisions.
- **Migration is additive.** Everything is provisioned into the gateway, and nothing is removed from API Management. A failed run leaves a partially built gateway and a source that still serves traffic exactly as before.
- **Secrets stay where they are.** No credential value is written to any artifact. Each one becomes a reference that carries the exact call that retrieves it, and the value is resolved just in time when the migration applies it.

### Create the inventory

When you invoke the skill, it first creates an inventory. The inventory identifies the objects on the source side, including which AI workloads the instance publishes, and the backends, policies, and credentials that each one depends on.

1. Sign in and select the subscription that holds the API Management instance.

   ```azurecli
   az login
   az account set --subscription <subscription-id>
   ```

1. Let the agent collect the inventory. The command it runs is:

   ```bash
   migrate-apim collect --apim <apim-name> -g <resource-group> -o inventory.json
   ```

   You can ask the agent to narrow the scope, restrict the asset families, or filter the APIs. It updates the command as follows:

   ```bash
   migrate-apim collect --apim <apim-name> -g <resource-group> --family mcp --family a2a
   migrate-apim collect --apim <apim-name> -g <resource-group> --include-api 'aoai-*' --exclude-api 'legacy-*'
   ```

1. Review what the agent found. The inventory records each asset family and how confident the detection is.

   | Family | How API Management represents it | How it's detected |
   |---|---|---|
   | MCP servers | APIs of type `mcp` | From the API type |
   | A2A agents | APIs of type `a2a` | From the API type |
   | Unified model APIs | APIs of type `unifiedModelApi` over `languageModel` backends | From the API type and the backend declaration |
   | Proxied model APIs | An ordinary `http` API in front of a model endpoint | Scored from weighted evidence: backend resource ID, provider host, AI policies, naming conventions, and inference routes |
   | Model providers | Not represented. Derived from the backends and service URLs that assets reference | Derived, including backends that no API publishes |

   Every API that the agent excluded is listed with its reason, so you can confirm that the agent didn't drop anything silently. Confirm any API reported with low confidence before you plan against it.

1. Check `collection.coverage` for failed reads before you trust the result. A failed read is an unknown, not an absence. If an entry failed because of access, collect again with the right permissions.

1. Read the summary with your workload owners.

   ```bash
   migrate-apim summary inventory.json --format markdown
   ```

> [!TIP]
> Operation-level policies aren't collected by default. Ask the agent to read them if you have them.

### Resolve items that need attention

The *plan* identifies the objects on the target side. It matches the inventory against a capability map of what the gateway and the installed CLI can actually do.

1. Let the agent produce the plan. Pass the target gateway as a full resource ID or ask to create a new one.

1. Work through the items that aren't settled. Each item carries a status:

   | Status | Meaning |
   |---|---|
   | `ready` | The gateway represents this natively, and the item already carries its target objects |
   | `needs-decision` | Confirm the proposal or choose a different option |
   | `adapted` | You settled it |
   | `excluded` | Another object carries it, and it's cross-referenced rather than dropped |
   | `stale` | The source facts that this item rested on changed, and the item says what moved |

   Every `needs-decision` item arrives with a proposal, a rationale, and the consequence of each option.

1. Record each decision on its item by setting only `status` to `adapted` and `decision` to the value you chose, then run `plan` again. Save the file as UTF-8 without a byte order mark.

   ```jsonc
   "decision": "split"
   "decision": {"value": "list-models", "models": ["gpt-4o", "gpt-5"]}
   ```

1. Read the plan's prerequisites. 

> [!IMPORTANT]
> These changes are outside the gateway's resource provider. Typical entries are Foundry role grants for the gateway's managed identity, the **AI Gateway Models User** and **AI Gateway Tools User** roles for callers, Microsoft Entra consent, OAuth authorization for an MCP backend, a delegated subnet for a network-integrated source, private endpoint approvals, and enabling the OpenTelemetry endpoint on an Application Insights resource.

### Deploy the resources

After you prepare your plan, start provisioning. The process runs in eight phases:

| Phase | What it provisions |
|---|---|
| `gateway` | The `Microsoft.ApiManagement/aigateways` resource |
| `identity` | The gateway's managed identity, used to reach backends |
| `providers` | One model provider per upstream model endpoint |
| `models` | One registration per model that the providers serve |
| `aliases` | The callable names, with their priority and weight pools |
| `toolServers` | Federated MCP servers and their backends, allow lists, and block lists |
| `policies` | Token limits on models, and the rate limit and IP filter baseline |
| `keys` | Gateway API keys and telemetry exporters, when the plan calls for them |

1. For each phase, the agent runs a preflight check.

   ```bash
   migrate-apim apply --plan plan.json --inventory inventory.json --preflight
   ```

   The preflight check prints the full phase checklist. Keep that checklist: a migration runs over many turns, and the phase that nobody tracks is the phase that goes missing.

1. Complete the prerequisites, and acknowledge each one only after you finish the work.

1. Rehearse the next phase. A run without `--execute` writes nothing and prints the exact command that each step would run. Review this output before creating anything.

   ```bash
   migrate-apim apply --plan plan.json --inventory inventory.json --next-phase
   ```

1. Execute the phase that you just rehearsed.

   ```bash
   migrate-apim apply --plan plan.json --inventory inventory.json --next-phase --execute
   ```

1. Repeat the rehearse-then-execute cycle for each remaining phase.

1. Check the status of the run at any point.

   ```bash
   migrate-apim apply --plan plan.json --inventory inventory.json --status
   ```


### Verify

Finish the migration by validating the gateway with real traffic, then cut over:

1. Issue new gateway keys or assign the data-plane roles to each caller.
1. Update every caller's host, route, and authorization header. If you split an API, some routes now resolve on the gateway and the rest still resolve on API Management.
1. Confirm that telemetry is arriving at the destination that you chose.
1. Retire the source assets from API Management only after you validate the new gateway. The migration process never removes anything, so you're responsible for that step.

## Workload-specific considerations

Each workload type carries its own constraints. Review the ones that apply to your instance before you settle on the plan.

### Model APIs

AI Gateway publishes a fixed set of inference routes, rather than publishing whatever operations an API defines:

```text
/openai/v1/chat/completions
/openai/v1/responses
/openai/v1/embeddings
/v1/messages
```

A typical Azure OpenAI import in API Management publishes far more routes than that. Assistants, threads, vector stores, audio, images, and legacy completions operations have no route on the gateway. So the first question about a model API isn't which object represents it but **how much of it can move**. The usual answer is to split the API: inference moves to the gateway, and the remaining operations keep serving from API Management until you retire them.

Two more constraints apply to model APIs:

- **Every alias needs a name.** The name that clients send in the `model` field is a new decision for each alias, because API Management has no equivalent to take it from.
- **The gateway doesn't translate between formats.** A unified model API can accept one dialect and call another. AI Gateway routes protocol-natively, so an Anthropic model is reached at `/v1/messages`. Callers either move to the backend dialect or keep a translating layer in front of the gateway.

### MCP servers

How you build an MCP API in API Management determines what moves:

- **A proxied server has no stored tool list.** API Management forwards `tools/list` to the upstream server, so the tool names that an allow list needs exist only at runtime and you must enumerate them first. The plugin does this with `discover-tools`.
- **A server that projects a REST API as tools** becomes a Federated MCP Server backend of kind `openApi` plus an allow list. Policies attached to individual tools don't carry over, so re-express them as allow list and block list entries, or keep them in API Management.

### A2A agents

AI Gateway has no equivalent for agent-to-agent APIs yet, so they stay on API Management for now. Identify them anyway: the inventory captures the agent's upstream endpoint, its JSON-RPC configuration, and the location of its agent card, so the configuration survives and you can move it when the gateway supports it.


### Policies

A token limit lands on each model registration that the source policy covered, so each model keeps its own ceiling. A rate limit or an IP filter has no per-model form: the gateway holds one baseline on the `default` workspace, so several source policies collapse into one and the strictest wins.

## Related content

- [AI Gateway and Azure API Management service](./compare-api-management-service.md)
- [AI Gateway concepts](./concepts.md)
- [Start with the Azure CLI extension](./get-started-cli.md)
