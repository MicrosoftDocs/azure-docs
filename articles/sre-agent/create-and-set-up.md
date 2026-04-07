---
title: Create and set up Azure SRE Agent
description: Deploy an Azure SRE Agent using the onboarding wizard, connect your GitHub repository, and grant Azure resource access.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/30/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: onboarding, create agent, setup, code repo, azure resources, getting started
#customer intent: As a site reliability engineer, I want to create an Azure SRE Agent and connect my code repo and Azure resources so that the agent can investigate issues across my environment.
---

# Create and set up Azure SRE Agent

Deploy an Azure SRE Agent, connect your code repository, and add Azure resource access.

## What you accomplish

- Deploy an Azure SRE Agent to your subscription
- Connect your GitHub code repository
- Grant the agent Reader access to your Azure resources

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Contributor** role on the subscription (needed to register resource providers and create resources). If your team assigns managed resource groups with RBAC, you also need **Owner** or **User Access Administrator** to create role assignments.
- Network access to `*.azuresre.ai` from your browser

## Open the onboarding wizard

1. Navigate to [sre.azure.com](https://sre.azure.com).
1. Sign in with your Azure credentials.
1. The wizard opens with a **three-step flow**: **Basics > Review > Deploy**.

## Configure basics

To define your agent, fill in the fields.

| Field | Description | Example |
|-------|-------------|---------|
| **Subscription** | The Azure subscription that owns the agent resource | `My Production Subscription` |
| **Resource group** | An existing resource group or create a new one | `rg-sre-agent` |
| **Agent name** | A unique name for your agent instance | `contoso-sre-agent` |
| **Region** | Azure region for deployment | `East US 2` |
| **Model provider** | Choose the AI model provider for your agent | See provider table |
| **Application Insights** | Create a new instance or use an existing one | `Create new` (default) |

After you select a region, the **Model provider** field appears. Choose the AI provider that powers your agent's investigations and conversations. Organizations with EU data residency requirements should select Azure OpenAI—Anthropic is excluded from EU Data Boundary (EUDB) commitments. Anthropic (Claude) models require a direct Anthropic agreement and aren't available to all tenants.

| Provider | Description |
|----------|-------------|
| **Anthropic** | Claude models—marked **Preferred** for most regions |
| **Azure OpenAI** | GPT models—covered by EU Data Boundary commitments for Sweden Central deployments |

Anthropic is selected by default for most regions. For **Sweden Central**, Azure OpenAI is selected by default. You can change the model provider after creation in **Settings > Basics**.

Select **Next** to proceed.

**Checkpoint:** All fields are filled, including the model provider. The **Next** button is enabled.

## Review

The wizard shows a summary of your configuration. Verify:

- Subscription and resource group are correct.
- Agent name and region match your intent.

Select **Create** to begin provisioning.

**Checkpoint:** The summary matches what you entered. No validation errors appear.

## Deploy

The deployment creates the following Azure resources:

| Resource | Purpose |
|----------|---------|
| **Managed Identity** | Authenticates the agent to Azure services |
| **Log Analytics Workspace** | Stores agent telemetry and diagnostic logs |
| **Application Insights** | Monitors agent health and performance |
| **Role Assignments** | Grants the managed identity required access |
| **Azure SRE Agent resource** | The agent itself |

If you selected **Create new** for Application Insights, the deployment also creates an Application Insights instance and Log Analytics Workspace.

Wait for the deployment to complete. This typically takes 2-5 minutes.

**Checkpoint:** Deployment status shows **Succeeded**. All resources are listed as created.

## Set up your agent

After deployment finishes, select **Set up your agent** to open the setup page. You'll see the header **"More context. Better investigations."** This page has two tabs:

| Tab | Data sources |
|-----|-------------|
| **Quickstart** | Code, Logs, Deployments, Incidents |
| **Full setup** | Everything in Quickstart + Azure Resources + Knowledge Files |

Start with the **Quickstart** tab. Not all sources are required, however connecting more sources gives your agent better context for investigations. This guide walks through connecting code (from Quickstart) and Azure resources (from Full setup).

### Connect your code repository

1. On the Code card, select the **+** button to connect repositories.
1. **Choose a platform**: Select **GitHub** (Azure DevOps is also supported).
1. **Choose sign in method**: Select **Auth** or **PAT**.
   - **Auth**: Select **Sign in**, authenticate in the browser, and approve access when prompted.
   - **PAT**: Paste your Personal Access Token and select **Connect**.
1. Select **Next** to proceed to repository selection.
1. **Pick repositories**: Use the dropdown to select one or more repositories—they're listed alphabetically for easy browsing.
1. Select **Add repository**.

**Checkpoint:** The Code card shows a green checkmark and lists the connected repositories.

> [!TIP]
> Connect the repository that contains the service you'll investigate first. Once connected, your agent immediately starts exploring the codebase and building expertise—learning your project structure, deployment configurations, and code patterns through [Deep Context](workspace-tools.md).

### Add Azure resource access

Granting the agent Reader access to your Azure resources allows it to query metrics, logs, and resource configurations during investigations.

1. On the setup page, switch to the **Full setup** tab (or use the Azure Resources card if visible on Quickstart).
2. On the Azure Resources card, select the **+** button to add resources.
3. **Choose resource type**: Select **Subscriptions** or **Resource groups**, then select **Next**.

**If you chose Subscriptions:**

4. **Select subscriptions**: Use the search box to find subscriptions. Check the ones you want the agent to access.
5. Select **Next** to review agent permissions.
6. The agent's managed identity is automatically granted **Reader** role on each selected subscription. Review the permissions status.
7. Select **Add subscriptions**.

**If you chose Resource groups:**

4. **Filter by subscription**: Use the subscription dropdown to filter which resource groups are shown.
5. **Select resource groups**: Use the search box to find resource groups. Check the ones you want the agent to access. The grid shows the resource group name, subscription, and region.
6. Select **Next** to review agent permissions.
7. Choose the permission level for the agent and review the role assignments.
8. Select **Add resource group**.

**Checkpoint:** The Azure Resources card shows the connected subscriptions or resource groups.

> [!TIP]
> The subscription picker shows **all** your subscriptions in two sections: those you can assign (where you have Owner or User Access Administrator) and those that require a higher role. A **User role** column displays your current role on each subscription. If you use **Privileged Identity Management (PIM)** for just-in-time access, the picker detects your active PIM role within seconds—no need to wait for cache refreshes.

> [!NOTE]
> After you add subscriptions or resource groups, the agent automatically assigns the required permissions to its managed identity. This can take a few seconds—you'll see the status update on the permissions review step. Reader role provides read-only access. For advanced permission management, see [Manage permissions and access](manage-permissions.md).

### Select "Done and go to agent"

Once you've connected your data sources, select **Done and go to agent**. This takes you into the agent chat to start team onboarding.

**Checkpoint:** The agent chat opens.

## Related content

- [Connectors](connectors.md)
- [User roles and permissions](user-roles.md)
- [Agent permissions](permissions.md)

## Next step

> [!div class="nextstepaction"]
> [Team onboarding](team-onboard.md)
