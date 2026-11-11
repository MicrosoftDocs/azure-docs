---
title: Azure Functions skill for best practices
description: Use the azure-functions-best-practices skill to review an existing function app and propose approval-gated improvements.
ms.topic: reference
ms.date: 09/23/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for best practices

The `azure-functions-best-practices` skill reviews an existing Azure Functions app for production-readiness concerns and proposes prioritized improvements.

**Skill:** `azure-functions-best-practices` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-best-practices/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill collects evidence about the app before making recommendations. It reviews areas such as runtime and hosting configuration, identity and security, networking, observability, reliability, performance, scale, cost, triggers, and bindings. It prioritizes findings and proposes remediations for your approval.

The skill doesn't update settings, restart or deploy the app, or change identity and role assignments without explicit approval. It reports setting names and presence but redacts secret values.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- An existing deployed Azure Functions app to review.
- An Azure sign-in with permission to read the app's configuration.
- An app inventory, which the skill can collect by using [`azure-functions-inventory`](azure-functions-inventory.md).

For a local project that hasn't been deployed, use [`azure-functions-doctor`](azure-functions-doctor.md) to review code and configuration before deployment. Local source and infrastructure-as-code files can supplement a best-practices review, but they don't replace the deployed app inventory.

## When to use this skill

Use this skill when you need to:

- Assess whether a function app is ready for production.
- Review configuration against current Azure Functions guidance.
- Identify security, reliability, observability, scale, or cost concerns.
- Prioritize findings by impact and remediation risk.
- Prepare a set of proposed changes for review before implementation.

Don't use this skill as the first response to an active outage. Use [`azure-functions-health-status`](azure-functions-health-status.md) to collect current signals and [`azure-functions-diagnostics`](azure-functions-diagnostics.md) to investigate symptoms.

## Example prompts

Try these prompts to activate this skill:

- "Review this function app against Azure Functions best practices."
- "Is this function app ready for production?"
- "Audit this app for security and reliability concerns."
- "Review my Functions configuration and prioritize the findings."
- "Propose safe fixes for the warnings in this function app."

## Related content

- [Azure Functions best practices](../functions-best-practices.md)
- [Azure Functions skill for inventory](azure-functions-inventory.md)
- [Azure Functions skill for health status](azure-functions-health-status.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-best-practices/SKILL.md)