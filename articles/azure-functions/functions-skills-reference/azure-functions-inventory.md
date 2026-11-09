---
title: Azure Functions skill for inventory
description: Use the azure-functions-inventory skill to collect static configuration, runtime, hosting, identity, network, and trigger details for a function app.
ms.topic: reference
ms.date: 09/23/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for inventory

The `azure-functions-inventory` skill collects the static specifications and configuration of an existing Azure function app.

**Skill:** `azure-functions-inventory` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-inventory/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This read-only skill collects resource identity, plan and SKU, operating system, runtime stack, Functions runtime version, Flex Consumption configuration, networking, managed identity, selected app-setting presence, deployed functions and triggers, and a summary of related resources. It redacts setting values and other secrets.

The skill reports specifications only. It doesn't analyze metrics, telemetry, exceptions, Activity Log events, or Resource Health.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- The function app name and, when needed to resolve ambiguity, its subscription or resource group.
- [Azure CLI](/cli/azure/install-azure-cli), signed in to an identity with permission to read the app and related resource metadata.

## When to use this skill

Use this skill when you need to:

- Establish a configuration baseline for a function app.
- Identify the app's runtime, hosting plan, operating system, and region.
- Review network access, virtual network integration, and managed identity configuration.
- List deployed functions, trigger types, and enabled or disabled status.
- Collect app specifications for a support handoff, review, or comparison.

Don't use this skill to determine whether the app is currently healthy. Use [`azure-functions-health-status`](azure-functions-health-status.md) instead.

## Example prompts

Try these prompts to activate this skill:

- "Collect a configuration inventory for this function app."
- "What runtime version and hosting plan does this app use?"
- "List the functions and trigger types deployed to this app."
- "Show the network and managed identity configuration for this function app."
- "Create a sanitized app inventory for a support handoff."

## Related content

- [Azure Functions hosting options](../functions-scale.md)
- [Azure Functions app settings reference](../functions-app-settings.md)
- [Azure Functions skill for health status](azure-functions-health-status.md)
- [Azure Functions skill for best practices](azure-functions-best-practices.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-inventory/SKILL.md)