---
title: Tool access policies in Azure SRE Agent
description: Control which tools your agent can use with allow, ask, and deny rules, scoped globally, per custom agent, or per conversation.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: tool-access-policies, permissions, allow, deny, ask, governance, policy, guardrails, approval, tools, security
#customer intent: As an SRE admin, I want to set allow/ask/deny rules on agent tools so that dangerous operations are blocked and safe ones auto-approve.
---

# Tool access policies in Azure SRE Agent

Tool access policies let you control which tools your agent can use. You set rules like "deny all delete commands," "allow monitoring queries without approval," or "ask before deployments." These rules apply regardless of how the tool was added to your agent.

Policies work alongside other controls like run modes, hooks, and connector governance. If you don't configure any policies, your agent uses run modes and connector settings as defaults.

## Three scopes for tool access policies

Set policies at three levels.

| Scope | Who sets it | Rules allowed | What it covers |
|-------|-------------|---------------|---------------|
| **Global** | Admin | Allow, Ask, **Deny** | All custom agents and conversations on this SRE Agent |
| **Custom agent** | Admin or author | Allow only | All conversations for one custom agent |
| **Thread** | Any user | Allow only | One conversation |

Only the global scope can deny tools. Custom agent and thread scopes can only add allow rules. They widen access within global boundaries but can never weaken a global deny.

## How tool access policy rules are evaluated

When the agent calls a tool, it checks the rules in this order:

1. **Deny** (global only): If matched, the tool is blocked.
1. **Allow** (any scope): If matched, the tool runs immediately, even in Review mode.
1. **Ask** (global only): If matched, the agent pauses for approval in Review mode, or auto-approves in Autonomous mode.
1. **No match**: No policy applies, default behavior takes effect.

> [!TIP]
> If a tool matches both an allow rule and an ask rule, allow takes priority. This means a user can add a thread-level allow to skip approval for a tool they already validated.

Rules use glob patterns on tool names. Patterns support `*` as a wildcard. For tools that execute commands (Azure CLI, kubectl, bash, Python), use `toolGlob(argGlob)` syntax to match arguments:

| Pattern | Matches |
|---------|---------|
| `RunAzCliWriteCommands` | Any Azure CLI write command |
| `bash(az * delete *)` | Any `az ... delete ...` command via bash/shell tools |
| `RunKubectlReadCommand(kubectl get *)` | Any `kubectl get` command |
| `*` | All tools |

The tool name in the pattern must match the runtime tool name. Aliases `bash`, `shell`, and `execute_bash` expand to match all command-string tools (Azure CLI, kubectl, shell commands) but **not** Python or PDF tools. Use `ExecutePythonCode` directly for Python patterns.

Runtime tool names that support argument patterns:

| Tool name | What it runs |
|-----------|--------------|
| `RunInTerminal` | Terminal commands |
| `RunShellCommand` | Shell commands |
| `RunAzCliReadCommands` | Azure CLI read operations |
| `RunAzCliWriteCommands` | Azure CLI write operations |
| `RunKubectlReadCommand` | kubectl read operations |
| `RunKubectlWriteCommand` | kubectl write operations |
| `ExecutePythonCode` | Python scripts |
| `RunPsqlReadCommand` | PostgreSQL read queries |
| `ValidatePsqlCommand` | PostgreSQL command validation |
| `GeneratePdfReport` | PDF report generation |

## How policies work with other controls

Your agent has several controls that determine whether a tool call proceeds. They're evaluated in priority order:

> [!IMPORTANT]
> A **user-defined** hook returning allow overrides policy rules, including global deny. System hooks can't trigger this override. Every override is audit-logged. Only SRE Agent **Administrators** can create hooks.

| Priority | Control | What it does |
|----------|---------|-------------|
| **Highest** | Hooks | Your scripts or LLM judges evaluate the tool call in context. A hook allow skips everything below. A hook deny blocks immediately. |
| **Down** | **Tool access policies** | Allow, ask, or deny by tool name pattern. A policy deny blocks. A policy allow skips default approval. |
| **Down** | Default approval | Connector Ask and RequiresApproval tools pause for user approval. |
| **Lowest** | Run modes | Review mode pauses, Autonomous mode auto-approves. |

### What happens in each scenario

| Hook policy | Access policy | Connector / RequiresApproval | Run mode | Result |
|------------|-------------|------------------------------|----------|--------|
| **Allow** | _any (skipped)_ | _any (skipped)_ | _any (skipped)_ | Executes immediately |
| **Deny** | _any (skipped)_ | _any (skipped)_ | _any (skipped)_ | Blocked |
| **Ask** | _any (skipped)_ | _any (skipped)_ | _any (skipped)_ | User approves |
| No policy | **Deny** | _any (skipped)_ | _any (skipped)_ | Blocked |
| No policy | **Allow** | _any (skipped)_ | _any (skipped)_ | Executes immediately |
| No policy | **Ask** | (none) | Review | User approves |
| No policy | **Ask** | (none) | Autonomous | Auto-approved |
| No policy | No match | **Ask** (connector or RequiresApproval) | Review | User approves |
| No policy | No match | **Ask** (connector or RequiresApproval) | Autonomous | Auto-approved |
| No policy | No match | No | _any_ | Executes |

**No policy** = no hooks configured, or hooks had no opinion on this tool.
**No match** = no access policy rules matched this tool. Either no rules exist, or the patterns don't cover it.

## Choose the right control for your scenario

| I want to... | Use |
|-------------|-----|
| Block specific dangerous tools everywhere | **Global deny** policy |
| Auto-approve safe read-only tools | **Allow** policy (global, custom agent, or thread) |
| Require confirmation for specific tools | **Ask** policy (global) |
| Give an on-call engineer a temporary override | **Thread-level allow** policy |
| Set different tool access per custom agent | **Custom-agent-level allow** policies |
| Evaluate tool arguments or context before deciding | Hooks |
| Control which SaaS operations are available | [Managed connectors](managed-connectors.md) |
| Set the broad approval workflow | Run modes |

## Configure tool access policies

### Global policies

Set via **Settings > Permissions** in the portal, or via the API:

```bash
curl -X PUT "https://<agent>/api/v2/agent/settings/global" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "allow": ["RunAzCliReadCommands", "RunKubectlReadCommand(kubectl get *)"],
      "ask": ["RunKubectlWriteCommand(kubectl apply *)"],
      "deny": ["bash(az * delete *)", "RunKubectlWriteCommand(kubectl delete *)"]
    }
  }'
```

### Custom-agent-level policies (allow only)

```bash
curl -X PUT "https://<agent>/api/v2/extendedAgent/my-k8s-agent/permissions" \
  -H "Content-Type: application/json" \
  -d '{ "allow": ["RunKubectlWriteCommand(kubectl apply *)", "RunKubectlWriteCommand(kubectl rollout *)"] }'
```

### Thread-level policies (allow only)

```bash
curl -X PUT "https://<agent>/api/v2/threads/<thread-id>/permissions" \
  -H "Content-Type: application/json" \
  -d '{ "allow": ["RunKubectlWriteCommand(kubectl apply -f deploy.yaml)"] }'
```

## Limits

| Limit | Value |
|-------|-------|
| Patterns per scope | 1,000 maximum |
| Pattern format | Tool name glob (supports `*` wildcard), or `toolGlob(argGlob)` for command tools |
| Argument matching | Supported for command-execution tools only (`bash`, `shell`, `execute_bash` aliases expand to all command tools) |
