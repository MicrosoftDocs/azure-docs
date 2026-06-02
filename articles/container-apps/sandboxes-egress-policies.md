---
title: Egress policies and network controls for Azure Container Apps Sandboxes (preview)
description: Egress policies for Azure Container Apps Sandboxes let you control outbound traffic from untrusted code. Learn how to define, evaluate, and enforce rules.
#customer intent: As a platform engineer running untrusted code in Azure Container Apps Sandboxes, I want to configure egress policies, so that I can control which outbound network requests are allowed.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 05/21/2026
ms.topic: concept-article
ms.service: azure-container-apps
---

# Egress policies and network controls for Azure Container Apps Sandboxes (preview)

Azure Container Apps Sandboxes are built to run code you don't fully trust, like AI-generated scripts, agent tool calls, and arbitrary user input. The network is where that code can do the most damage, so every sandbox ships with a built-in egress policy engine that decides what outbound traffic is allowed, blocked, or transformed.

You define the egress policy as part of the sandbox create request, alongside the disk image and resource tier, so the policy is in effect from the moment the sandbox starts. You can also update the policy on a running sandbox; subsequent outbound requests are evaluated against the updated policy.

This article covers the policy model, how rules are evaluated, and the patterns recommended for running untrusted workloads safely.

To edit egress policies, expand the menu to reveal the menu where you can select **Egress Policy**.

:::image type="content" source="media/sandboxes-egress-policies/azure-container-apps-egress-policies.png" alt-text="Screenshot of of the egress policy editor drop down list." lightbox="media/sandboxes-egress-policies/azure-container-apps-egress-policies.png":::

[!INCLUDE [sandboxes-create-manage](includes/sandboxes-create-manage.md)]

## Egress policy model

An egress policy answers two questions for every outbound request a sandbox makes:

- Should this request be allowed?

- Should this request be transformed (for example, by injecting an authentication header or rewriting the destination)?

A policy has the following shape:

| Field | Description |
|---|---|
| **Default action** | `Allow` or `Deny`. Applied to any request that doesn't match a more specific rule. |
| **Rules** | Rules that match on host, path, and HTTP method, and support `Allow`, `Deny`, `Transform`, and `Rewrite` actions. |
| **Traffic inspection** | Controls how the egress proxy inspects traffic (`Partial`, `Full`, `None`). |

The recommended starting posture for any sandbox that runs untrusted code is `default_action = Deny` plus an explicit allow list of the destinations the workload needs.

## Where policies live

You can apply egress policies at two scopes:

- **At create time**: Set on the request that creates the sandbox, so the workload starts under the policy.

- **At runtime**: Update on a running sandbox via the SDK. The new policy takes effect for subsequent requests.

## Rule evaluation order

Egress decisions follow a predictable order:

1. **Rules** are evaluated in the order they appear in the `rules` list. The first rule whose `match` (host, path, method) matches the request wins. The action attached to that rule is applied.

1. **Default action** is applied when no rule matches.

Order rules from most specific to most general. A `Deny` rule on `api.example.com/admin` placed before an `Allow` rule on `api.example.com` blocks the admin path while letting the rest of the API run.

## Rule actions

Rules support four action types:

| Action | Use case |
|---|---|
| **Allow** | Let the request unchanged. |
| **Deny** | Block the request before it leaves the sandbox. |
| **Transform** | Let the request and modify its headers (for example, inject an authentication token). |
| **Rewrite** | Let the request and rewrite the destination scheme, host, or path. |

`Transform` and `Rewrite` together let you front a sandbox's outbound calls with policy that authenticates and routes them without the sandbox ever needing to hold the credentials directly.

## Header transforms and credential injection

For workloads that call authenticated upstream APIs, `Transform` actions can attach headers from one of three sources:

- **Static value**: A literal string baked into the rule.

- **Secret reference**: Pulled from the sandbox group's Secrets store. Use a format string like `Bearer {value}` to combine the secret with a constant prefix.

- **Managed identity reference**: A token acquired on demand from a managed identity for a specified resource URI.

This pattern is especially useful for AI agent scenarios where the agent needs to call an LLM API, but without the agent code to handle the API key directly.

## Traffic inspection

The egress proxy supports several inspection modes:

| Mode | Behavior |
|---|---|
| **Full** | All traffic is inspected. `Deny` rules are enforced, and non-HTTP traffic is blocked. |
| **Partial** | Only traffic that matches a rule is inspected. Non-HTTP traffic is allowed. |
| **None** | No egress rules are applied. |
| **Legacy** | All traffic is inspected. Non-HTTP traffic is allowed. |

Choose `Partial` or `Full` to use rules. Set inspection to `None` only when latency matters more than control and you trust the destination.

## Considerations

| Area | Detail |
|---|---|
| **Default-deny posture** | Workloads that run untrusted code should default to `Deny` and add narrow allow rules for the destinations they need. |
| **Policy lifecycle** | Policies are mutable on running sandboxes. Updates apply to subsequent requests; in-flight requests aren't reevaluated. |
| **Per-environment policies** | Maintain separate policies for development, staging, and production. Devs can iterate against a permissive policy while production stays locked down. |
| **Audit cadence** | Pull egress decisions periodically from long-running sandboxes and review denied counts. A spike usually indicates a workload misconfiguration or an exfiltration attempt. |
| **Skip the proxy carefully** | Traffic inspection `None` trades safety for latency. Only set it for sandboxes that don't run untrusted code and only for trusted destinations. |

## Related content

- [Snapshots overview](sandboxes-overview.md)
- [Snapshots and state management for Container Apps Sandboxes](sandboxes-snapshots-state-management.md)