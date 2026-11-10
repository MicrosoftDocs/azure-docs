---
title: Azure Functions skills reference
description: Reference for the skills that help coding agents create, review, deploy, monitor, and troubleshoot Azure Functions apps.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skills reference

Azure Functions skills give coding agents Functions-specific workflows and reference material. Use this catalog to understand what each installed skill provides, when to use it, and which prompts can activate it.

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

For installation and a first workflow, see [Azure Functions skills for coding agents](../functions-skills.md).

## Workflow skills

| Skill | Purpose |
| --- | --- |
| [`azure-functions-help`](azure-functions-help.md) | Discover and route to the skill that best matches your Azure Functions goal. |
| [`azure-functions-setup`](azure-functions-setup.md) | Verify tools and language runtimes for Azure Functions development. |
| [`azure-functions-create`](azure-functions-create.md) | Create a Functions project or add a function to an existing project. |
| [`azure-functions-hosted-skills`](azure-functions-hosted-skills.md) | Build and manage an app that uses Azure Functions hosted skills. |
| [`azure-functions-hosted-skills-migrate`](azure-functions-hosted-skills-migrate.md) | Convert an existing workflow to a hosted skill after an explicit request to use this skill by name. |
| [`azure-functions-connector-create`](azure-functions-connector-create.md) | Create and authorize a Connector Namespace connection for hosted skills. |
| [`azure-functions-connector-mcp`](azure-functions-connector-mcp.md) | Generate and register connector MCP tools from authoritative operation metadata. |
| [`azure-functions-connector-validate`](azure-functions-connector-validate.md) | Validate connector identity, MCP contracts, and external results before automated use. |
| [`azure-functions-deploy`](azure-functions-deploy.md) | Add Functions-specific context and delegate deployment to Azure Skills. |
| [`azure-functions-update`](azure-functions-update.md) | Migrate Functions programming models and configuration after an explicit request to use this skill by name. |
| [`azure-functions-best-practices`](azure-functions-best-practices.md) | Review an existing function app and propose approval-gated improvements. |
| [`azure-functions-diagnostics`](azure-functions-diagnostics.md) | Investigate deployment, runtime, trigger, binding, and worker issues. |
| [`azure-functions-health-status`](azure-functions-health-status.md) | Collect current app health, metrics, telemetry, and recent changes. |
| [`azure-functions-inventory`](azure-functions-inventory.md) | Collect static configuration and resource details for a function app. |
| [`azure-functions-doctor`](azure-functions-doctor.md) | Analyze a local Functions project before deployment. |
| [`azure-functions-feedback`](azure-functions-feedback.md) | Turn session findings into a previewed issue or pull request. |

## Supporting skill

The [`azure-functions-common`](azure-functions-common.md) skill is a shared reference pack used by other Azure Functions skills. It isn't a standalone customer workflow.

## Related content

- [Azure Functions skills source repository](https://github.com/Azure/azure-functions-skills)
- [Azure Skills overview](/azure/developer/azure-skills/overview)
- [Use AI tools and models in Azure Functions](../functions-create-ai-enabled-apps.md)