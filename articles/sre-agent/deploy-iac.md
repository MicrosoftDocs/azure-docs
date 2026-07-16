---
title: Deploy with infrastructure as code in Azure SRE Agent
description: Deploy Azure SRE Agent using Bicep, Terraform, PowerShell, or Azure Developer CLI with pre-built templates.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 05/12/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: iac, bicep, terraform, deployment, automation, ci-cd, templates
#customer intent: As a DevOps engineer, I want to deploy Azure SRE Agent programmatically so I can version control and automate deployments.
---

# Deploy with infrastructure as code in Azure SRE Agent

Deploy Azure SRE Agent programmatically by using templates from the [microsoft/sre-agent](https://github.com/microsoft/sre-agent) repository.

> [!TIP]
> - **Four deploy backends:** Bicep, Terraform, PowerShell, and Azure Developer CLI
> - **Prebuilt recipes** for common scenarios (Azure Monitor, PagerDuty, Dynatrace)
> - **One command** to go from zero to a running agent: `./bin/deploy.sh my-agent/`
> - **Day-2 operations:** export, clone, diff, and verify agents by using the same CLI tools

## Overview

The [microsoft/sre-agent](https://github.com/microsoft/sre-agent) repository provides production-ready IaC templates for deploying Azure SRE Agent. Use these templates to:

- **Automate deployments** in CI/CD pipelines
- **Version-control** agent configuration in Git
- **Replicate** agents across environments (dev to staging to prod)
- **Standardize** setup by using prebuilt recipes

## Prerequisites

| Tool | Required for | Install |
|------|-------------|---------|
| Azure CLI 2.x+ | All backends | [Install](/cli/azure/install-azure-cli) |
| jq | All backends | `brew install jq` or `apt install jq` |
| Terraform 1.5+ | Terraform only | [Install](https://developer.hashicorp.com/terraform/install) |
| PowerShell 7+ | PowerShell only | [Install](/powershell/scripting/install/installing-powershell) |
| Azure Developer CLI | azd only | [Install](/azure/developer/azure-developer-cli/install-azd) |

**Azure permissions:** Owner on the subscription, or Contributor + User Access Administrator.

**Verify prerequisites:**

```bash
git clone https://github.com/microsoft/sre-agent.git
cd sre-agent/sreagent-templates
bash bin/check-prerequisites.sh
```

## Quick start

```bash
# 1. Generate config from a recipe
./bin/new-agent.sh --recipe azmon-lawappinsights --non-interactive \
  --set agentName=my-agent \
  --set resourceGroup=rg-my-agent \
  --set location=eastus2 \
  --set targetRGs=rg-my-workload \
  -o my-agent/

# 2. Deploy (~3 minutes)
./bin/deploy.sh my-agent/
```

After deployment, the CLI prints the portal URL and data plane endpoint:

```
Agent (portal):  https://sre.azure.com/#/agent/{sub}/{rg}/my-agent
Data plane:      https://my-agent.eastus2.azuresre.ai
```

### Clone an existing agent

```bash
./bin/clone-agent.sh \
  --from-agent prod-agent --from-rg rg-prod \
  --set agentName=staging-agent --set resourceGroup=rg-staging \
  -o staging-agent/
```

Exports the source agent's config and deploys to a new name and resource group. This is useful for replicating across environments.

## Recipes

Prebuilt starting points for common scenarios like Azure Monitor alert response, PagerDuty incident management, and Dynatrace integration. Microsoft regularly adds new recipes.

Browse available recipes in the [templates repository](https://github.com/microsoft/sre-agent/tree/main/sreagent-templates/recipes).

```bash
# List available recipes
ls recipes/

# Generate config from a recipe
./bin/new-agent.sh --recipe azmon-lawappinsights \
  --set agentName=prod-agent \
  --set resourceGroup=rg-prod-agent \
  --set location=swedencentral \
  -o prod-agent/
```

## Deploy backends

The templates support four deployment backends. Each uses the same config directory - pick the one that fits your environment:

| Backend | Command | Use when |
|---------|---------|----------|
| **Bicep** | `./bin/deploy.sh my-agent/` | Default - uses `az deployment sub create` |
| **Terraform** | `./bin/deploy-tf.sh my-agent/` | Terraform-managed infrastructure |
| **PowerShell** | `.\bin\ps\Deploy-Agent.ps1 -InputPath .\my-agent\` | Windows / PowerShell 7 environments |
| **Azure Developer CLI** | `cd my-agent/ && azd up` | azd-based workflows |

All backends support `--what-if` / `--dry-run` for validation without deploying. For full command reference, flags, and requirements, see the [repository README](https://github.com/microsoft/sre-agent/tree/main/sreagent-templates#deploy-backends).

## Config directory structure

When you run `new-agent.sh`, it generates a config directory:

```
my-agent/
├── agent.json              # Agent identity, model, settings
├── connectors.json         # Data sources (App Insights, Log Analytics, MCP endpoints)
├── connectors.secrets.env  # Secrets — auto-gitignored
├── roles.yaml              # RBAC role assignments
├── config/
│   ├── skills/             # Skill instructions (YAML + markdown)
│   ├── subagents/          # Subagent definitions (YAML + markdown instructions)
│   ├── hooks/              # Safety guardrails (YAML)
│   ├── common-prompts/     # Shared prompt instructions
│   └── repos/              # Code repository connections
├── automations/
│   ├── scheduled-tasks/    # Recurring automated tasks
│   ├── incident-filters/   # Incident routing rules
│   └── incident-platforms/  # Incident platform connections
└── data/
    ├── knowledge/          # Upload docs, runbooks, reference material
    └── synthesized-knowledge/ # Agent's learned context
```

Edit these files to customize your agent before deploying.

## What gets deployed

Deployment happens in two phases.

### Phase 1: ARM (infrastructure)

| Resource | Purpose |
|----------|---------|
| Resource Group | Container for all resources |
| User-Assigned Managed Identity | Agent's Azure identity |
| Log Analytics Workspace | Logging and diagnostics |
| Application Insights | Telemetry |
| SRE Agent (`Microsoft.App/agents`) | The agent itself |
| RBAC role assignments | Reader, Monitoring Reader, Log Analytics Reader, SRE Agent Administrator |
| Connectors, skills, subagents, tools | Agent configuration via ARM sub-resources |

### Phase 2: Data plane (config that ARM can't handle yet)

| Resource | Reason for data plane |
|----------|----------------------|
| Code repositories | Require Git authentication (PAT/OAuth) |
| Hooks | Not yet exposed as ARM sub-resources at deploy time |
| HTTP triggers | Generated server-side with unique URLs |
| Knowledge files | Binary file upload |
| Plugin configurations | Data-plane-only API |

> [!NOTE]
> The `apply-extras.sh` script handles Phase 2 automatically after the Bicep/Terraform deployment completes. If the data-plane token is unavailable (for example, in a restricted CI/CD environment), it prints what was skipped so you can finish from a machine with access.

## Key parameters

When you generate a config by using `new-agent.sh --set`, enter values such as `agentName`, `resourceGroup`, `location`, and `targetRGs`. The process translates these values into deployment parameters for Bicep or Terraform.

For the full list of parameters, feature toggles, and their defaults, see the [repository README](https://github.com/microsoft/sre-agent/tree/main/sreagent-templates#parameters).

## Day-2 operations

The templates include scripts for ongoing management:

| Operation | What it does |
|-----------|-------------|
| **Export** | Create a config directory from a running agent - useful for backup or migration |
| **Clone** | Export a source agent and deploy to a new name and resource group |
| **Diff** | Compare your local config against the live agent |
| **Verify** | Run a 22-point check against the live agent (connectors, skills, subagents, hooks) |

For commands and usage, see the [repository README](https://github.com/microsoft/sre-agent/tree/main/sreagent-templates#day-2-operations).

## Related content

- [API reference](api-reference.md)
- [Supported regions](supported-regions.md)
- [Pricing and billing](pricing-billing.md)
- [Network requirements](network-requirements.md)
