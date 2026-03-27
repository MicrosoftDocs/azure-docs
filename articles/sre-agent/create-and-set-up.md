---
title: Create and set up Azure SRE Agent
description: Deploy an Azure SRE Agent using the onboarding wizard, connect your GitHub repository, and grant Azure resource access.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: onboarding, create agent, setup, code repo, azure resources, getting started
#customer intent: As a site reliability engineer, I want to create an Azure SRE Agent and connect my code repo and Azure resources so that the agent can investigate issues across my environment.
---

# Create and set up Azure SRE Agent

**Estimated time**: 10 minutes

Deploy an Azure SRE Agent, connect your code repository, and grant the agent access to your Azure resources.

## What you accomplish

By the end of this guide, you have:

- Deployed an Azure SRE Agent to your subscription
- Connected your GitHub code repository
- Granted the agent Reader access to your Azure resources

## Prerequisites

| Requirement | Details |
|---|---|
| **Azure subscription** | An active Azure subscription with permission to create resources. |
| **Role** | **Contributor** on the subscription (needed to register resource providers and create resources). If your team assigns managed resource groups with RBAC, you also need **Owner** or **User Access Administrator** to create role assignments. |
| **Network access** | `*.azuresre.ai` must be reachable from your browser. See [Network requirements](network-requirements.md). |

## Open the onboarding wizard

Navigate to the onboarding wizard to start creating your agent.

1. Go to [sre.azure.com](https://sre.azure.com).
1. Sign in by using your Azure credentials.
1. The wizard opens with a three-step flow: **Basics** > **Review** > **Deploy**.

## Configure basics

To define your agent, fill in the fields.

| Field | Description | Example |
|---|---|---|
| **Subscription** | The Azure subscription that owns the agent resource. | `My Production Subscription` |
| **Resource group** | An existing resource group, or create a new one. | `rg-sre-agent` |
| **Agent name** | A unique name for your agent instance. | `contoso-sre-agent` |
| **Region** | Azure region for deployment. | `East US 2` |
| **Application Insights** | Create a new instance or use an existing one. | `Create new` (default) |

:::image type="content" source="media/create-and-setup/wizard-basics.png" alt-text="Screenshot of the create agent wizard with subscription, resource group, agent name, and region fields filled in." lightbox="media/create-and-setup/wizard-basics.png":::

Select **Next** to proceed.

**Checkpoint:** All fields are filled and the **Next** button is enabled.

## Review

The wizard shows a summary of your configuration. Verify the following details:

- Subscription and resource group are correct.
- Agent name and region match your intent.

:::image type="content" source="media/create-and-setup/wizard-review.png" alt-text="Screenshot of the review step showing the agent configuration summary before deployment." lightbox="media/create-and-setup/wizard-review.png":::

Select **Create** to begin provisioning.

**Checkpoint:** The summary matches what you entered. No validation errors appear.

## Deploy

The deployment creates the following Azure resources.

| Resource | Purpose |
|---|---|
| **Managed identity** | Authenticates the agent to Azure services. |
| **Log Analytics workspace** | Stores agent telemetry and diagnostic logs. |
| **Application Insights** | Monitors agent health and performance. |
| **Role assignments** | Grants the managed identity required access. |
| **Azure SRE Agent resource** | The agent itself. |

If you select **Create new** for Application Insights, the deployment also creates an Application Insights instance and a Log Analytics workspace.

Wait for the deployment to complete. This step typically takes 2 to 5 minutes.

:::image type="content" source="media/create-and-setup/deploy-success.png" alt-text="Screenshot of the deployment succeeded status with all resources listed as created." lightbox="media/create-and-setup/deploy-success.png":::

**Checkpoint:** Deployment status shows **Succeeded** and all resources are listed as created.

## Set up your agent

After the deployment finishes, select **Set up your agent** to open the setup page. The page displays two tabs for connecting data sources.

| Tab | Data sources |
|---|---|
| **Quickstart** | Code, Logs, Deployments, Incidents |
| **Full setup** | Everything in Quickstart plus Azure Resources and Knowledge Files |

Start with the **Quickstart** tab. You don't need to connect all sources, but connecting more sources gives your agent better context for investigations. The following sections walk through connecting code (from Quickstart) and Azure resources (from Full setup).

:::image type="content" source="media/create-and-setup/setup-page.png" alt-text="Screenshot of the setup page showing data source cards for Code, Logs, Deployments, and Incidents." lightbox="media/create-and-setup/setup-page.png":::

### Connect your code repository

Connect a GitHub repository so your agent can analyze source code during investigations.

1. On the Code card, select the **+** button to connect repositories.
1. **Choose a platform**: Select **GitHub** (Azure DevOps is also supported).
1. **Choose sign in method**: Select **Auth** or **PAT**.
   - **Auth**: Select **Sign in**, authenticate in the browser, and approve access when prompted.
   - **PAT**: Paste your Personal Access Token and select **Connect**.
1. Select **Next** to proceed to repository selection.
1. **Pick repositories**: Use the dropdown to select one or more repositories for the agent to explore.

    :::image type="content" source="media/create-and-setup/repo-picker.png" alt-text="Screenshot of the repository picker dropdown showing available GitHub repositories." lightbox="media/create-and-setup/repo-picker.png":::

1. Select **Add repository**.

:::image type="content" source="media/create-and-setup/code-connected.png" alt-text="Screenshot of the Code card showing a green checkmark with the connected repository." lightbox="media/create-and-setup/code-connected.png":::

**Checkpoint:** The Code card shows a green checkmark and lists the connected repositories.

> [!TIP]
> Connect the repository that contains the service you plan to investigate first. Once connected, your agent immediately starts exploring the codebase and building expertise. It learns your project structure, deployment configurations, and code patterns through [deep context](workspace-tools.md).

### Add Azure resource access

Grant the agent Reader access to your Azure resources so it can query metrics, logs, and resource configurations during investigations.

1. On the setup page, switch to the **Full setup** tab (or use the Azure Resources card if visible on Quickstart).
1. On the Azure Resources card, select the **+** button to add resources.
1. **Choose resource type**: Select **Subscriptions** or **Resource groups**, and then select **Next**.

Follow the steps for the resource type you selected.

**If you chose Subscriptions:**

1. Use the search box to find subscriptions. Check the ones you want the agent to access.
1. Select **Next** to review agent permissions.
1. The agent's managed identity automatically gets the **Reader** role on each selected subscription. Review the permissions status.
1. Select **Add subscriptions**.

**If you chose Resource groups:**

1. Use the subscription dropdown to filter which resource groups are shown.
1. Use the search box to find resource groups. Check the ones you want the agent to access. The grid shows the resource group name, subscription, and region.
1. Select **Next** to review agent permissions.
1. Choose the permission level for the agent, and review the role assignments.
1. Select **Add resource group**.

**Checkpoint:** The Azure Resources card shows the connected subscriptions or resource groups.

> [!NOTE]
> After you add subscriptions or resource groups, the agent automatically assigns the required permissions to its managed identity. This assignment can take a few seconds. You see the status update on the permissions review step. The Reader role provides read-only access. For advanced permission management, see [Permissions and roles](permissions.md).

### Go to your agent

After you connect your data sources, select **Done and go to agent** to open the agent chat.

**Checkpoint:** The agent chat opens.

## Next step

> [!div class="nextstepaction"]
> [Step 2: Team onboarding](team-onboard.md)

## Related content

- [Connectors](connectors.md): How the agent connects to external data sources
- [User roles](user-roles.md): Who can access your agent and what they can do
- [Permissions and roles](permissions.md): How permission levels and RBAC roles work
