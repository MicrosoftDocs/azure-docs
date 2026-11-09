---
title: Azure Functions skill for diagnostics
description: Use the azure-functions-diagnostics skill to investigate deployment, runtime, trigger, binding, and language-worker issues.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for diagnostics

The `azure-functions-diagnostics` skill investigates Azure Functions deployment failures, runtime errors, trigger and binding problems, language-worker issues, and related telemetry. Use the comparison in this article to choose among inventory, health-status, diagnostics, and local doctor workflows.

**Skill:** `azure-functions-diagnostics` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-diagnostics/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## Choose the right operational skill

| Goal | Skill |
| --- | --- |
| Collect static configuration, runtime, hosting, identity, network, and trigger details. | [`azure-functions-inventory`](azure-functions-inventory.md) |
| Check current app state, metrics, telemetry, Resource Health, and recent changes. | [`azure-functions-health-status`](azure-functions-health-status.md) |
| Investigate symptoms, correlate evidence, and recommend a root-cause fix. | `azure-functions-diagnostics` |
| Analyze code and configuration in a local workspace before deployment. | [`azure-functions-doctor`](azure-functions-doctor.md) |

## What it provides

This skill is a diagnostic orchestrator. It gathers app context through the inventory and health-status skills, identifies the affected runtime or trigger, and loads only the relevant language, extension, or recovery guidance. It separates confirmed evidence from hypotheses and recommends validation steps and remediations.

The skill redacts credentials, connection strings, and secret setting values from its output.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- The error message, symptom, or unexpected behavior to investigate.
- For a deployed app, its name and an Azure sign-in with permission to read relevant configuration and telemetry.
- A time window for a deployed incident, when known.

## When to use this skill

Use this skill when you need to:

- Diagnose a deployment that failed or completed without discovering functions.
- Investigate runtime exceptions, timeouts, startup failures, or unavailable endpoints.
- Determine why a trigger isn't firing or a binding can't connect.
- Troubleshoot language-worker, extension, or host initialization errors.
- Interpret health, telemetry, inventory, and configuration evidence together.

For source-file and semantic checks on a local project before deployment, use [`azure-functions-doctor`](azure-functions-doctor.md). For current status without root-cause analysis, use [`azure-functions-health-status`](azure-functions-health-status.md).

## Example prompts

Try these prompts to activate this skill:

- "Why is my HTTP-triggered function returning 404?"
- "Diagnose this Azure Functions startup error."
- "My deployment succeeded, but Azure didn't discover any functions."
- "Why isn't my Event Hubs trigger firing?"
- "Investigate these Application Insights exceptions for my function app."

## Related content

- [Diagnose and solve problems in Azure Functions](../functions-diagnostics.md)
- [Azure Functions skill for health status](azure-functions-health-status.md)
- [Azure Functions skill for inventory](azure-functions-inventory.md)
- [Azure Functions skill for doctor](azure-functions-doctor.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-diagnostics/SKILL.md)