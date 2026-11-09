---
title: Azure Functions skill for deploy
description: Use the azure-functions-deploy skill to add Azure Functions context and delegate preparation, validation, and deployment to Azure Skills.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for deploy

The `azure-functions-deploy` skill adds Azure Functions-specific requirements to a deployment request and delegates deployment planning, validation, and execution to Azure Skills.

**Skill:** `azure-functions-deploy` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-deploy/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill identifies a Functions project, gathers service-specific context, and hands the workflow to the appropriate [Azure Skills](/azure/developer/azure-skills/overview). The context can include hosting recommendations, operating-system requirements, authentication, Application Insights, runtime configuration, and deployment storage.

The skill normally delegates deployment commands to Azure Skills. If that path is unavailable or unsuitable, it explains what a fallback would skip and asks for your approval.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- Azure Skills installed with the `azure-prepare`, `azure-validate`, and `azure-deploy` skills available.
- An Azure Functions project with a `host.json` file.
- An Azure subscription and [Azure CLI](/cli/azure/install-azure-cli) version 2.60 or later, signed in with `az login`.
- The permissions required to create or update the planned Azure resources.
- Azure Developer CLI, signed in with `azd auth login`, for `azd` deployments.

For [Go apps (preview)](../functions-reference-go.md), use Azure CLI 2.87.0 or later and Core Tools 4.12 or later. Go apps run on Linux and require the Flex Consumption plan.

## When to use this skill

Use this skill when you need to:

- Prepare and deploy a Functions project to Azure.
- Generate a deployment plan that includes Functions-specific requirements.
- Validate infrastructure and application configuration before deployment.
- Deploy a project that already contains `azure.yaml`, infrastructure files, and template metadata.
- Verify a deployed function app after the Azure Skills workflow completes.

Don't use this skill for local project creation without deployment. Use [`azure-functions-create`](azure-functions-create.md) instead.

For the template-based hosted-skills deployment workflow, use [`azure-functions-hosted-skills`](azure-functions-hosted-skills.md).

## Example prompts

Try these prompts to activate this skill:

- "Create a deployment plan for this function app."
- "Deploy this Azure Functions project to Azure after validating it."
- "Deploy my Python function app to Flex Consumption with Application Insights."
- "Validate the infrastructure for this Functions project before deployment."
- "Deploy this template-based Functions project and verify the result."

## Deployment workflow

For a project that isn't already prepared, the skill delegates these stages to Azure Skills:

1. [`azure-prepare`](/azure/developer/azure-skills/skills/azure-prepare) analyzes the app and prepares the deployment plan and infrastructure.
1. [`azure-validate`](/azure/developer/azure-skills/skills/azure-validate) checks deployment readiness and infrastructure.
1. [`azure-deploy`](/azure/developer/azure-skills/skills/azure-deploy) executes the deployment.

Projects created from supported Azure MCP templates can already contain the deployment plan and infrastructure. For those projects, the workflow can proceed directly to validation and deployment.

## Related content

- [Azure Functions deployment technologies](../functions-deployment-technologies.md)
- [Azure Skills overview](/azure/developer/azure-skills/overview)
- [Azure Functions skill for create](azure-functions-create.md)
- [Azure Functions skill for doctor](azure-functions-doctor.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-deploy/SKILL.md)