---
title: Azure Functions skill for health status
description: Use the azure-functions-health-status skill to collect current app state, metrics, telemetry, Resource Health, and recent Azure activity.
ms.topic: reference
ms.date: 09/23/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for health status

The `azure-functions-health-status` skill collects and interprets current operational signals for an existing Azure function app.

**Skill:** `azure-functions-health-status` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-health-status/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This read-only skill reports app and plan state, Resource Health, Azure Monitor metrics, trigger status, Application Insights or Log Analytics telemetry, and recent Activity Log events. It uses a requested time window, or the previous 24 hours by default, and reports unavailable or unsupported signals as data gaps.

The skill collects only the configuration needed to interpret health. It doesn't produce a full static app inventory.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- The function app name and, when needed to resolve ambiguity, its subscription or resource group.
- [Azure CLI](/cli/azure/install-azure-cli), signed in to an identity with permission to read the app, metrics, telemetry, Resource Health, and Activity Log.
- Application Insights or Log Analytics data for telemetry-based results. The skill reports a gap when telemetry isn't available.

## When to use this skill

Use this skill when you need to:

- Check whether a function app and its plan are running.
- Review failures, exceptions, traces, or dependencies for a time window.
- Examine request counts, failure rates, latency, CPU, memory, or instance metrics.
- Check Resource Health and recent Azure Activity Log events.
- Collect operational evidence before deeper diagnostics.

Don't use this skill for a detailed static configuration inventory. Use [`azure-functions-inventory`](azure-functions-inventory.md) instead.

## Example prompts

Try these prompts to activate this skill:

- "Check the current health of my production function app."
- "Show failures and exceptions for this function app in the last 24 hours."
- "What was the p95 request latency during the last hour?"
- "Is Azure Resource Health reporting a problem for this app?"
- "Collect the health signals I need before diagnosing this incident."

## Related content

- [Monitor executions in Azure Functions](../functions-monitoring.md)
- [Azure Functions skill for diagnostics](azure-functions-diagnostics.md)
- [Azure Functions skill for inventory](azure-functions-inventory.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-health-status/SKILL.md)