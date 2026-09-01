---
title: Create and Set Up Azure SRE Agent
description: Deploy Azure SRE Agent, connect source code and telemetry, and optionally grant Azure resource access.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 08/21/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: onboarding, create agent, setup, code repo, azure resources, getting started
#customer intent: As a site reliability engineer, I want to create an agent and connect source code and telemetry so that the agent can investigate my environment.
---

# Create and set up Azure SRE Agent

Azure SRE Agent is an AI solution that helps site reliability engineers (SREs) investigate and operate their environments. This article shows you how to create an agent, connect source code and telemetry, and optionally grant access to Azure resources.

[!INCLUDE [evaluate-offer](includes/evaluate-offer.md)]

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Deploy an agent to your subscription.
> - Connect a code repository.
> - Connect a telemetry source.
> - Optionally grant the agent access to Azure resources.

## Prerequisites

| Requirement | When | Details |
|---|---|---|
| **Azure subscription** | Required | An active Azure subscription with permission to create resources. For Azure SRE Agent charges, see [Pricing and billing](pricing-billing.md). |
| **Role to create the agent** | Required | **Owner**, or **Contributor** plus **User Access Administrator**, on the subscription or resource group where you create the agent. These permissions let the portal deploy the agent and assign your account **SRE Agent Administrator** on it. |
| **Azure resource access** | As needed | When you add Azure scopes during setup, you need an active **Owner** or **User Access Administrator** role assignment on every scope, directly or through inheritance. If you use PIM for a subscription, activate the eligible role before setup, then use **Check PIM role assignments** in the picker. These permissions let the portal assign the required Azure roles to the agent's managed identity. |
| **Network access** | Required | `*.azuresre.ai` must be reachable from your browser. |

## Open the onboarding wizard

1. Go to the [Azure SRE Agent](https://sre.azure.com) webpage.
1. Sign in with your Azure credentials.
1. Select **Create agent**. The wizard has three stages: **Basics** > **Review** > **Deploy**.

## Configure basics

To define your agent, fill in the fields.

| Field | Description | Example |
|-------|-------------|---------|
| **Subscription** | Use the Azure subscription that owns the agent resource. | **My Production Subscription** |
| **Resource group** | Use an existing resource group, or create a new one. | **rg-sre-agent** |
| **Agent name** | Select a unique name for your agent. | **contoso-sre-agent** |
| **Region** | Select the Azure region for deployment. | **East US 2** |
| **Model provider** | Select an available AI model provider for your agent. | Varies by subscription and region. |
| **Application Insights** | Create a new instance, or use an existing one. | **Create new** (default) |

After you select a region, the **Model provider** field appears. Your subscription and region load the available providers and default selection. Options might include **Azure OpenAI** and **Anthropic**, depending on the supported models returned for the selected subscription and region.

For provider costs and consumption details, see [Pricing and billing](pricing-billing.md).

You can change the provider after creation in your **agent settings**.

> [!NOTE]
> In EUDB regions, the wizard labels providers either **Covered by EU Data Boundary commitments** or **Excluded from EU Data Boundary. Data might be processed in the United States.**
>
> See [Data privacy and residency](data-privacy.md#data-residency) for provider data-handling details.

Select **Next** to proceed.

**Checkpoint:** All the fields are filled, including the model provider. The **Next** button is enabled.

## Review

The wizard shows a summary of your configuration. Verify that the:

- Subscription and resource group are correct.
- Agent name and region match your intent.

Select **Create** to begin provisioning.

**Checkpoint:** The summary matches what you entered. No validation errors appear.

## Deploy

The deployment creates the following Azure resources.

| Resource | Purpose |
|----------|---------|
| **Managed identities (SAMI and UAMI)** | Deployment creates a UAMI and enables both system-assigned and user-assigned identities on the agent. Use the UAMI for connector authentication and Azure RBAC assignments; the SAMI supports agent infrastructure. See [Agent identity](agent-identity.md). |
| **User role assignment** | Assigns the current user **SRE Agent Administrator** on the new agent. |
| **Azure SRE Agent resource** | The agent itself. |
| **Application Insights and Log Analytics workspace** | Created only when you select **Create new** for Application Insights. |

If you select an existing Application Insights resource, the deployment links it to the agent instead of creating new monitoring resources.

Wait for the deployment to complete. This step typically takes two to five minutes.

**Checkpoint:** Deployment status shows **Succeeded**. The deployment details list the agent resource and each supporting resource that was created.

## Set up your agent

After deployment finishes, select **Set up your agent** to open the setup page. You see the header **More context. Better investigations**. This page has the following two tabs.

| Tab | Data sources |
|-----|-------------|
| **Quickstart** | Code, Logs, Azure resources, Incidents |
| **Full setup** | Everything in Quickstart + Knowledge files |

Start with the **Quickstart** tab. Source code and telemetry provide enough context to begin investigating. Azure resource access is optional.

### Connect your code repository

1. On the **Code** card, select the **+** button. Its tooltip is **Connect repositories**.
1. In **Connection**, select **GitHub**, **Azure DevOps**, or **GitLab**.
1. Select one of the authentication methods offered for that platform.
   - **GitHub**: Your account, personal access token (PAT), or a bring-your-own GitHub App. GitHub Enterprise Cloud requires a GitHub App.
   - **Azure DevOps**: Your account, managed identity, or PAT.
   - **GitLab**: PAT.
1. Select **Next**.
1. In **Add repositories**, select one or more repositories.
1. Select **Save**.

**Checkpoint:** The **Code** card shows a green checkmark and lists the connected repositories.

> [!TIP]
> Connect the repository that contains the service that you plan to investigate first. When connected, your agent immediately starts exploring the codebase and building expertise. Your agent learns your project structure, deployment configurations, and code patterns through [deep context](agent-reasoning.md#deep-context).

### Connect your logs

When you connect log sources, your agent can access production telemetry, including error traces, performance metrics, and application health data. When you combine this data with source code, your agent can correlate production issues with code changes during investigations.

For Log Analytics or Application Insights, the portal assigns **Log Analytics Reader** and **Monitoring Reader** to the agent's managed identity when you save the connector. You can connect multiple log sources. See [Azure observability](diagnose-azure-observability.md) and [External observability](diagnose-observability.md).

1. On the **Logs** card, select the **+** button.
1. In **Configure logging provider**, select a provider. Core Azure options include:

   | Logging provider | What it provides |
   |---|---|
   | **Azure Data Explorer** | Operational and application data stored in Azure Data Explorer. |
   | **Log Analytics Workspace** | Logs, activity logs, and metrics from Log Analytics workspaces. |
   | **Application Insights** | Application telemetry, requests, dependencies, and performance metrics. |

   Use search in the picker to find other providers available for your environment. The complete list can vary by tenant and configuration.

1. Select **Next** and complete the fields shown for your provider.
1. Select **Next** to review, and then select **Add connector**.

**Checkpoint:** The **Logs** card shows a green checkmark and lists the connected telemetry source.

Ask your agent to verify access:

```text
Check for any errors in the last 24 hours
```

### Add Azure resource access (optional)

Azure resource access is optional. Add it when you want the agent to inspect resource configuration, health, and metrics directly. Before you begin, review the **Azure resource access** requirements in [Prerequisites](#prerequisites).

Use resource-group scope by default. Choose a subscription or management group only when the agent needs broader access, and review the inherited blast radius before continuing.

1. On the **Quickstart** tab, find the **Azure resources** card and select **Add resources**.
1. In **Choose resource type**, select **Management group**, **Subscription**, or **Resource group**, and then select **Next**.

   - If you choose **Management group**:

      1. Select one or more management groups.
      1. Review the inherited permissions. The agent receives **Reader** and **Azure Monitor Monitoring Contributor** on the management group and its descendants.
      1. Select the add button to continue. Its label reflects whether you selected one or multiple management groups.

   - If you choose **Subscription**:

      1. Use the search box to find subscriptions. Select the ones that you want the agent to access.
      1. Select **Next** to review agent permissions.
      1. Review the permissions status. The agent's managed identity receives **Reader** and **Azure Monitor Monitoring Contributor** on each selected subscription.
      1. Select **Add subscription** for one selection or **Add subscriptions** for multiple selections.

   - If you choose **Resource group**:

       1. Use the multi-select **Subscription** filter to choose which subscriptions are shown.
       1. Search by resource-group or subscription name, and then select the resource groups you want the agent to access. The grid shows the resource group name, subscription, and region.
       1. Select **Next** to review agent permissions.
       1. Choose the permission level and review the role assignments:
          - **Reader** assigns the base **Reader**, **Monitoring Reader**, and **Log Analytics Reader** roles, plus reader or operator roles required by the resource types in the group.
          - **Privileged** keeps the base roles and adds contributor, administrator, or operator roles required by the resource types in the group.
       1. Select **Add resource group**.

**Checkpoint:** The **Azure Resources** card lists each connected management group, subscription, or resource group.

> [!NOTE]
> After you select the final add button, role assignment can take several minutes. To remove access, remove the scope from the **Azure Resources** card. The portal attempts to revoke the managed role assignments; manually remove remaining assignments only if it reports a partial cleanup failure. See [Manage permissions and access](manage-permissions.md).

### Select Done and go to agent

After you connect to your data sources, select **Done and go to agent**. This action takes you into the agent chat to start team onboarding.

**Checkpoint:** The agent chat opens.

## Related content

- [Connectors](connectors.md)
- [User roles and permissions](user-roles.md)
- [Agent permissions](permissions.md)
- [Team onboarding](team-onboard.md)
