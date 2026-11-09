---
title: Azure Functions skills for coding agents
description: Learn how Azure Functions skills give coding agents Azure Functions-specific guidance for creating, reviewing, deploying, and troubleshooting function apps.
ms.topic: concept-article
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
# Customer intent: As a developer, I want to use Azure Functions skills with my coding agent so that I can create and manage function apps with Azure Functions-specific guidance.
---

# Azure Functions skills for coding agents

Install Azure Functions skills to give your coding agent Azure Functions-specific instructions and reference material. The skills help an agent create projects, review code and configuration, prepare deployments, inspect deployed apps, and diagnose problems. They run in your development environment and guide the agent that works on your function app.

[!INCLUDE [Azure Functions skills preview](../../includes/functions-skills-preview.md)]

Azure Functions skills support GitHub Copilot, Claude Code, and Codex. The package includes 17 skills, Azure MCP configuration for template discovery, and an optional telemetry integration. For the source and latest release information, see the [Azure Functions skills repository](https://github.com/Azure/azure-functions-skills).

## Distinguish skills from runtime AI experiences

Azure Functions skills operate in your development environment; they don't run inside your function app. Several related experiences use the term *skill* or *agent*, but they solve different problems:

| Experience | Use it when you want to |
| --- | --- |
| Azure Functions skills | Give a coding agent Functions-specific guidance for creating, reviewing, deploying, monitoring, and troubleshooting function apps. |
| [Azure Functions hosted skills](functions-hosted-skills.md) | Run a declaratively defined, event-driven AI workload in a Python function app. |
| [Agent bindings for Python](functions-agent-bindings.md) | Invoke an injected Microsoft Agent Framework `Agent` from a Python function handler. |
| [Azure Skills](/azure/developer/azure-skills/overview) | Give a coding agent broader Azure preparation, validation, and deployment workflows. |
| [Azure Agent Skills](/training/support/agent-skills) | Give an AI agent curated Microsoft Learn guidance for Azure services. |

To compare the runtime options for adding AI reasoning and tools to a function app, see [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md).

## Compose with Azure Skills

Azure Functions skills are designed to compose with [Azure Skills](/azure/developer/azure-skills/overview). Install both when a workflow combines Functions-specific development or operations with broader Azure tasks or related Azure services. Your coding agent can use skills from both packages in the same workflow: Azure Functions skills contribute service-specific patterns and context, while Azure Skills provide broader, cross-service Azure workflows. You can also use either package independently when your task needs only its scope.

For example, the `azure-functions-deploy` skill adds Functions-specific requirements and delegates preparation, validation, and deployment execution to Azure Skills.

The `azure-functions-hosted-skills` authoring skill has a separate deployment workflow. It uses its template infrastructure and runs `azd up` after you approve deployment. The connector skills manage connection setup, MCP publication, and validation for hosted-skills apps.

## Prerequisites

To install or use Azure Functions skills, you need:

- Node.js 22 or later. GitHub Copilot CLI requires Node.js 24 or later.
- A supported coding agent: GitHub Copilot, Claude Code, or Codex.
- A trusted local workspace where your coding agent can read and, when you approve changes, update your project.

Other requirements depend on your task. For example, local development usually requires [Azure Functions Core Tools](functions-run-local.md), and deployed-resource workflows require the [Azure CLI](/cli/azure/install-azure-cli) and an Azure sign-in. After installation, ask your agent to check your environment. The `azure-functions-setup` skill identifies missing tools and provides installation guidance.

## Install Azure Functions skills

Install the plugin from the `Azure/azure-functions-skills` marketplace by using your coding agent's plugin manager.

### GitHub Copilot CLI

Start an interactive Copilot session, and then run these commands:

```text
/plugin marketplace add Azure/azure-functions-skills
/plugin install azure-functions-skills@azure-functions-skills
```

### GitHub Copilot app

1. Open **Settings**, and then select **Plugins**.
1. Select **Install**, and then add `Azure/azure-functions-skills` as a marketplace.
1. Select **azure-functions-skills**, review its contents, and confirm the installation.

### GitHub Copilot in Visual Studio Code

1. Enable the `chat.plugins.enabled` setting. Your organization might manage this setting.
1. Add `Azure/azure-functions-skills` to `chat.plugins.marketplaces` in your user `settings.json` file.
1. In the Extensions view, search for `@agentPlugins`, and then install **azure-functions-skills**.

Visual Studio Code can also discover plugins installed by GitHub Copilot CLI. For more information, see [Use agent plugins in Visual Studio Code](https://code.visualstudio.com/docs/agent-customization/agent-plugins).

### Claude Code

Start an interactive Claude Code session, and then run these commands:

```text
/plugin marketplace add Azure/azure-functions-skills
/plugin install azure-functions-skills@azure-functions-skills
```

### Codex CLI

Add the marketplace from your terminal:

```bash
codex plugin marketplace add Azure/azure-functions-skills
```

Start Codex, run `/plugins`, select **azure-functions-skills**, and then select **Install plugin**.

## Try your first workflow

After installation, start with these prompts:

1. Ask **"Check my Azure Functions development environment."** The `azure-functions-setup` skill checks your tools and language runtime and provides guidance for missing prerequisites.
1. Ask **"Which Azure Functions workflow should I use for this project?"** The `azure-functions-help` skill discovers the installed Functions skills and routes your request.
1. Ask for a task, such as **"Create a TypeScript Azure Functions project with an HTTP trigger and verify it locally."** The agent loads the relevant skill and supporting references.
1. Before deployment, ask **"Check this local Functions project with azure-functions-doctor."** The agent checks code, configuration, packaging, and dependencies.
1. If you want to deploy, install Azure Skills and ask **"Create a deployment plan for this function app, validate it, and deploy it to Azure."** Azure Functions skills contribute the Functions-specific context, and Azure Skills owns deployment execution.

## Review a local project safely

The [`azure-functions-doctor`](functions-skills-reference/azure-functions-doctor.md) skill guides your coding agent through local project checks. It reads source files and loads the checklists that match the project. Checks cover configuration, code, trigger and binding patterns, packaging, and supply-chain risks.

The skill doesn't run project code, installation scripts, or package-manager install commands for a check. It reports findings with evidence and recommended fixes. It doesn't change project files during analysis. Ask the agent to apply fixes only after you review the findings.

## Choose a migration workflow

Two skills support different migration goals:

- [`azure-functions-update`](functions-skills-reference/azure-functions-update.md) migrates Functions programming models and configuration. The current scenario is C# in-process to .NET isolated worker.
- [`azure-functions-hosted-skills-migrate`](functions-skills-reference/azure-functions-hosted-skills-migrate.md) converts an existing workflow into an Azure Functions hosted skill.

To start either workflow, name the skill and explicitly ask to use it. A question or quoted skill name doesn't start migration. The `azure-functions-help` skill can recommend a migration skill, but it doesn't start it automatically.

## Manage telemetry

Usage telemetry includes allowlisted skill and tool names, relative allowlisted skill-file paths, the client name, a session identifier, and a timestamp. It doesn't include file contents, prompts, raw tool arguments, credentials, or absolute paths.

The deployment skills can also send an `azure_deployment_observed` event after a successful `azd up` or standalone `azd provision`. This event has seven categorical properties: `skill`, `operation`, `result`, `resourceTypes`, `deploymentKind`, `agent`, and `skillsVersion`.

To confirm deployment success, the collector uses your existing Azure CLI sign-in to read the named Azure Resource Manager deployment. The event doesn't include deployment names, subscription or resource group identifiers, or credentials. It records an observed deployment, not proof that a skill caused it.

The plugin includes a local telemetry runtime. Automatic hooks don't download packages. Update installed plugins to receive runtime changes.

Set either of these environment variables to `false` to disable telemetry:

- `AZURE_FUNCTIONS_SKILLS_COLLECT_TELEMETRY`
- `AZURE_MCP_COLLECT_TELEMETRY`

The runtime also checks installed and workspace `telemetry.config.json` files, including workspace settings in ancestor directories. A disabled or unreadable configuration stops collection before Azure queries or event transmission.

## Explore the skill reference

The [Azure Functions skills reference](functions-skills-reference/index.md) describes when to use each published skill, its prerequisites and boundaries, and prompts that activate it. Start with `azure-functions-help` when you aren't sure which workflow applies.

## Related content

- [Azure Functions skills source repository](https://github.com/Azure/azure-functions-skills)
- [Azure Skills overview](/azure/developer/azure-skills/overview)
- [GitHub Copilot for Azure](/azure/developer/github-copilot-azure)
- [Develop Azure Functions locally using Core Tools](functions-run-local.md)