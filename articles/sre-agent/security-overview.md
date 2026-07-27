---
title: Security overview for Azure SRE Agent
description: Learn how Azure SRE Agent isolates execution, handles credentials, stores data, and protects your environment with built-in security architecture.
ms.topic: article
ms.service: azure-sre-agent
ms.date: 04/29/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: security, isolation, secretless, credentials, data residency, encryption
#customer intent: As an SRE or security engineer, I want to understand how Azure SRE Agent handles security so that I can evaluate it for my organization's compliance requirements.
---

# Security overview for Azure SRE Agent

Azure SRE Agent uses defense-in-depth security across four areas: execution isolation, secretless credentials, data residency, and per-customer separation. Each layer operates independently so that a compromise in one area doesn't cascade to others.

For permissions and identity details, see [Agent permissions](permissions.md) and [Agent identity](agent-identity.md).

## Execution isolation

The agent's reasoning engine and tool execution run in separate compute boundaries.

### Sandbox architecture

Each agent has its own sandbox. This means that each gets a dedicated compute environment running in a micro VM that's separate from the reasoning loop.

| Component | Runs in | Role |
|---|---|---|
| **Agent reasoning** | Main runtime | Processes messages, selects tools, builds responses |
| **Tool execution** | Sandbox (micro VM) | Runs file operations, bash commands, code analysis, MCP tools |
| **Identity sidecar** | Separate service | Manages credentials and tokens, isolated from reasoning and execution |
| **Network proxy** | Separate service | Validates and routes all outbound requests |

The agent communicates with its sandbox exclusively through structured API calls and never through direct file system or process access.

### Tool process lifecycle

Each tool invocation launches a fresh process inside the sandbox:

1. A new process starts with its own environment.
1. The network proxy proxies input and output streams through WebSocket.
1. On completion, the entire process tree terminates.

The system doesn't use persistent process pools. Environment variables and credentials are scoped per connection, so one tool call can't see another tool call's environment.

### Code execution

Python and shell commands run inside the sandbox through the [code interpreter](code-interpreter.md):

- Execution is isolated from your resources and the agent's reasoning engine.
- The environment includes more than 700 preinstalled Python packages, but it doesn't support arbitrary package installation.
- An egress proxy controls network access and limits it to known service domains.

## Secretless credential management

The execution environment never holds credentials directly. Instead, an isolated identity sidecar manages all tokens and provides them on demand to individual tool processes.

### How credentials flow

1. The agent determines a tool call is needed.
1. The request routes to the sandbox.
1. The identity sidecar issues a short-lived token to the tool process.
1. The tool makes the authenticated call through the network proxy.
1. Results return to the agent. Credentials never enter the reasoning context.

Three properties make credential theft structurally impossible:

- **Identity sidecar isolation**: A separate service manages all credentials outside the agent's execution environment.
- **Per-call scoping**: Tokens are scoped to individual tool invocations, not shared across the sandbox.
- **No environment variable inheritance**: Only explicitly declared variables are forwarded to tool processes.

### Credential lifetime

| Type | Lifetime | Refresh |
|---|---|---|
| **Managed identity tokens** | ~1 hour (Azure platform standard) | Automatic via Azure SDK |
| **OAuth tokens** (GitHub, ADO) | Varies by provider | Refreshed 20 minutes before expiry |
| **Action tokens** (per tool call) | Single use | Issued fresh per invocation |
| **Blob storage SAS tokens** | 1 hour | Refreshed 15 minutes before expiry |

## Data residency

When your agent investigates an issue, it queries your data sources. The agent doesn't write raw query results like log entries, metrics, and API responses to a separate data store. When the agent processes a tool call, it serializes chat and tool messages, including result summaries, into the persistent conversation thread.

The following data **is** persisted:

| Data | Storage | Retention | Purpose |
|---|---|---|---|
| **Conversation threads** | Agent database | Until manually deleted | Chat history, investigation records |
| **Session insights** | Agent database and blob storage | Persistent | Synthesized learnings such as symptoms, resolution steps, and root causes |
| **Memory files** | Blob storage | Persistent across sessions | Synthesized knowledge, team context, repo instructions |
| **Thread files** | Blob storage | Tied to thread lifetime | User uploads, generated reports |

Session insights are synthesized summaries, not raw data copies. The agent extracts patterns (what symptoms appeared, what resolution worked, and what to avoid) and stores those as knowledge. The agent doesn't independently persist complete raw query results. It stores serialized tool messages, which might include result excerpts or summaries, as part of the conversation thread history.

## Per-customer isolation

| Layer | Isolation model |
|---|---|
| **Compute** | Dedicated sandbox per agent |
| **Database** | Separate database per agent |
| **Blob storage** | Separate blob storage per agent |
| **Network** | Per-agent proxy instance for all outbound requests |
| **Credentials** | Per-agent managed identity with RBAC scoped to customer-selected resource groups |

No data, compute, or credentials are shared between agents or customers.

## Logging and observability

Your agent sends operational telemetry to the Application Insights instance you configure during setup, giving you full visibility into agent operations.

| Telemetry | Details |
|---|---|
| **Conversation traces** | Correlated by trace ID and span ID for end-to-end request tracking |
| **Tool call dependencies** | Method, URL, duration, and status code for every outbound call |
| **Errors and exceptions** | Full exception details |
| **Custom events** | Hook activations, incident events, and other agent-specific operations |

Telemetry from sandbox tool execution flows through the same pipeline.

## Encryption

| Layer | Protection |
|---|---|
| **At rest** | Azure-managed encryption protects all data at rest |
| **In transit** | All external communication uses HTTPS |

## Network proxy and policies

All outbound network access from the execution environment flows through a proxy layer that enforces the following policies:

- **Request validation**: Every outbound connection is validated before reaching an external service.
- **Credential injection**: The proxy attaches scoped tokens from the identity sidecar; tool code never handles tokens directly.
- **Environment scoping**: Only explicitly declared environment variables are forwarded to tool processes.
- **Process lifecycle**: Tool processes are terminated on completion or timeout.

## On-behalf-of fallback

When the agent's managed identity lacks permissions for an operation, the system falls back to acting on your behalf:

1. The agent attempts the operation with its managed identity.
1. Permissions are insufficient, and you see an **Approve action** prompt with operation details.
1. You approve, and the operation executes with your credentials.
1. Your credentials aren't cached after completion.

Run modes control this behavior: **Review** mode requires approval for write operations, while **Autonomous** mode uses the managed identity directly. For more information, see [Agent permissions](permissions.md).

## Private network access

Azure SRE Agent supports deployment configurations for private network requirements:

- **Regional isolation** - Sandbox placement respects regional boundaries (for example, East US 2 sandboxes stay within Central US, North Central US, or Canada Central).
- **VNet-integrated execution**: Dedicated sandboxes can be configured for execution within your virtual network.
- **Secretless credential access**: The identity service provides short-lived credentials to tool processes without storing credentials in the sandbox.

## Related content

- [Agent identity](agent-identity.md)
- [Agent permissions](permissions.md)
- [Run modes](run-modes.md)
- [Code interpreter](code-interpreter.md)
