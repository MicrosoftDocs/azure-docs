---
title: Create and Set Up Azure SRE Agent
description: Deploy Azure SRE Agent by using the onboarding wizard, connect your GitHub repository, and grant Azure resource access.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/30/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: onboarding, create agent, setup, code repo, azure resources, getting started
#customer intent: As a site reliability engineer, I want to set up Azure SRE Agent, create an agent, and connect my code repo and Azure resources so that the agent can investigate issues across my environment.
---

# Create and set up Azure SRE Agent

Azure SRE Agent is an AI solution that helps site reliability engineers (SREs) manage Azure cloud resources. This article shows you how to set up Azure SRE Agent and create an agent.

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Deploy an agent to your subscription.
> - Connect your GitHub code repository.
> - Grant the agent Reader access to your Azure resources.

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Contributor role on the subscription. (You need it to register resource providers and create resources.) If your team assigns managed resource groups with role-based access control, you also need Owner or User Access Administrator privileges to create role assignments.
- Network access to `*.azuresre.ai` from your browser.

## Open the onboarding wizard

1. Go to the [Azure SRE Agent](https://sre.azure.com) webpage.
1. Sign in with your Azure credentials.
1. Select **Basics** > **Review** > **Deploy** to open the wizard.

## Configure basics

To define your agent, fill in the fields.

| Field | Description | Example |
|-------|-------------|---------|
| **Subscription** | Use the Azure subscription that owns the agent resource. | **My Production Subscription** |
| **Resource group** | Use an existing resource group, or create a new one. | **rg-sre-agent** |
| **Agent name** | Select a unique name for your agent. | **contoso-sre-agent** |
| **Region** | Select the Azure region for deployment. | **East US 2** |
| **Model provider** | Select the AI model provider for your agent. | See provider table. |
| **Application Insights** | Create a new instance, or use an existing one. | **Create new** (default) |

After you select a region, the **Model provider** field appears. Select the AI provider that powers your agent's investigations and conversations. Select the ℹ icon next to the label for [pricing details](pricing-billing.md).

Organizations with European Union (EU) data residency requirements should select Azure OpenAI. Anthropic is excluded from EU Data Boundary commitments. Anthropic (Claude) models require a direct Anthropic agreement and aren't available to all tenants.

| Provider | Description |
|----------|-------------|
| **Anthropic** | Claude models are marked **Preferred** for most regions. |
| **Azure OpenAI** | GPT models are covered by EU Data Boundary commitments for Sweden Central deployments. |

Anthropic is selected by default for most regions. For **Sweden Central**, Azure OpenAI is selected by default. You can change the model provider after creation in **Settings** > **Basics**.

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
| Managed identity | Authenticates the agent to Azure services. |
| Log Analytics workspace | Stores agent telemetry and diagnostic logs. |
| Application Insights | Monitors agent health and performance. |
| Role assignments | Grants the managed identity required access. |
| SRE Agent resource | Is the agent itself. |

If you selected **Create new** for Application Insights, the deployment also creates an Application Insights instance and Log Analytics workspace.

Wait for the deployment to complete. This step typically takes two to five minutes.

**Checkpoint:** Deployment status shows **Succeeded**. All resources are listed as created.

## Set up your agent

After deployment finishes, select **Set up your agent** to open the setup page. You see the header **More context. Better investigations**. This page has the following two tabs.

| Tab | Data sources |
|-----|-------------|
| **Quickstart** | Code, logs, deployments, incidents |
| **Full setup** | Everything in Quickstart + Azure Resources + Knowledge Files |

Start with the **Quickstart** tab. Not all sources are required, although connecting more sources gives your agent better context for investigations. This guide walks through connecting code (from **Quickstart**) and Azure resources (from **Full setup**).

### Connect your code repository

1. On the **Code** card, select the **+** button to connect repositories.
1. To choose a platform, select **GitHub**. (Azure DevOps is also supported.)
1. To choose a sign-in method, select **Auth** or **PAT**.
   - **Auth**: Select **Sign in**, authenticate in the browser, and approve access when prompted.
   - **PAT**: Paste your personal access token (PAT) and select **Connect**.
1. Select **Next** to proceed to repository selection.
1. Use the dropdown list to select one or more repositories. They're listed alphabetically.
1. Select **Add repository**.

**Checkpoint:** The **Code** card shows a green checkmark and lists the connected repositories.

> [!TIP]
> Connect the repository that contains the service that you plan to investigate first. When connected, your agent immediately starts exploring the codebase and building expertise. Your agent learns your project structure, deployment configurations, and code patterns through [deep context](workspace-tools.md).

### Add Azure resource access

Granting the agent Reader access to your Azure resources allows it to query metrics, logs, and resource configurations during investigations.

1. On the setup page, switch to the **Full setup** tab. You can also use the **Azure Resources** card if it's visible on **Quickstart**.
1. On the **Azure Resources** card, select the **+** button to add resources.
1. To choose the resource type, select **Subscriptions** or **Resource groups**, and then select **Next**.

   - If you choose **Subscriptions**:

      1. Use the search box to find subscriptions. Select the ones that you want the agent to access.
      1. Select **Next** to review agent permissions.
      1. The agent's managed identity is automatically granted the Reader role on each selected subscription. Review the permissions status.
      1. Select **Add subscriptions**.

   - If you choose **Resource groups**:

       1. To filter by subscription, use the subscription dropdown list to filter which resource groups are shown.
       1. To select resource groups, use the search box to find resource groups. Select the ones that you want the agent to access. The grid shows the resource group name, subscription, and region.
       1. Select **Next** to review agent permissions.
       1. Choose the permission level for the agent, and review the role assignments.
       1. Select **Add resource group**.

**Checkpoint:** The **Azure Resources** card shows the connected subscriptions or resource groups.

The subscription picker shows all of your subscriptions in two sections. It shows the subscriptions that you can assign (where you have Owner or User Access Administrator privileges), and the subscriptions that require a higher role. A **User role** column shows your current role on each subscription. If you use **Privileged Identity Management (PIM)** for just-in-time access, the picker detects your active PIM role within seconds. You don't need to wait for cache refreshes.

After you add subscriptions or resource groups, the agent automatically assigns the required permissions to its managed identity. This step can take a few seconds. The status update appears in the permissions review step. The Reader role provides read-only access. For advanced permission management, see [Manage permissions and access](manage-permissions.md).

### Select Done and go to agent

After you connect to your data sources, select **Done and go to agent**. This action takes you into the agent chat to start team onboarding.

**Checkpoint:** The agent chat opens.

## Related content

- [Connectors](connectors.md)
- [User roles and permissions](user-roles.md)
- [Agent permissions](permissions.md)
- [Team onboarding](team-onboard.md)
