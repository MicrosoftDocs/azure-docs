---
title: "Step 1: Create Your Agent in Azure SRE Agent"
description: Deploy an Azure SRE Agent and grant it access to your Azure resources.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As a site reliability engineer, I want to deploy an Azure SRE Agent so that I can monitor and investigate issues across my Azure resources.
ms.custom: references_regions
---

# Step 1: Create your agent in Azure SRE Agent
**Estimated time**: 5 minutes

Deploy your agent and grant it access to your Azure resources.

## What you accomplish

By the end of this step, your agent is:

- Deployed in your Azure subscription
- Granted access to any resources you selected during setup (you can add more later)
- Ready to answer questions about your infrastructure

## Prerequisites

| Requirement | Details |
|---|---|
| **Azure subscription** | Active subscription with the `Microsoft.App` resource provider registered. |
| **Permissions** | **Owner** or **User Access Administrator** role on the subscription (needed to assign RBAC roles to the agent's managed identity). |
| **Resource group** | Existing resource group, or create one during setup. |
| **Network access** | `*.azuresre.ai` must be allowed through your firewall. See [Network requirements](network-requirements.md). |
| **Region** | Your subscription must allow resource creation in Sweden Central, East US 2, or Australia East. |

> [!NOTE]
> If the **Create** button is unavailable or deployment fails with "DeploymentNotFound", register the resource provider:
>
> ```azurecli
> az provider register --namespace "Microsoft.App"
> ```
>
> Then try creating the agent again.

## Open the creation wizard

1. Go to [sre.azure.com](https://sre.azure.com).

    If you're not signed in, you see the landing page with an overview of SRE Agent capabilities, sample demos, and getting-started resources. Select **Sign In** to proceed.

1. After signing in, select **Create agent**.

:::image type="content" source="media/create-agent/agents-list.png" alt-text="Screenshot of the agent list with the Create button highlighted.":::

## Configure basics

Fill in the required fields for your agent.

| Field | What to enter |
|---|---|
| **Subscription** | Your Azure subscription |
| **Resource group** | Choose existing or create new |
| **Agent name** | Descriptive name (for example, `prod-monitoring`) |
| **Region** | Sweden Central, East US 2, or Australia East |
| **Application Insights** | Create new (recommended) |

:::image type="content" source="media/create-agent/create-agent-wizard-basics.png" alt-text="Screenshot of the create agent wizard showing the basics configuration fields.":::

Select **Next**.

## Select resource groups to monitor (optional)

Choose which Azure resources your agent can access. This step is optional. You can skip it and grant access later. For more information, see [Alternative: Subscription-level access](#alternative-subscription-level-access).

> [!NOTE]
> You need **Owner** or **User Access Administrator** permissions on any resource groups you want to assign to the agent.

1. Select resource groups that contain your apps, databases, or infrastructure.
1. Use filters to find specific groups across subscriptions.
1. Select multiple resource groups as needed.

> [!NOTE]
> The agent gets read access to resources in these groups, including logs, metrics, and configurations. It can't make changes unless you grant Privileged permissions later.

> [!TIP]
> Select one or two resource groups to start, or skip this step entirely. You can add more resources later from **Settings** > **Managed resources**.

Select **Next**.

## Choose a permission level

Set the permission level for the managed resource groups you selected. If you skipped the previous step, these permissions don't apply to anything yet, but you still need to complete this step.

| Level | What it means | When to use |
|---|---|---|
| **Reader** (recommended) | Agent can read only. Actions require your approval. | Start here for the safest option. |
| **Privileged** | Agent can execute approved actions directly. | After you trust the agent. |

The wizard shows which Azure RBAC roles are assigned (Log Analytics Reader, Monitoring Reader, AKS Cluster User, and others).

> [!TIP]
> To control whether actions execute automatically or require approval, see [Run modes](run-modes.md).

Select **Next**.

## Review and deploy

Complete the deployment process.

1. Review your configuration.
1. Select **Create**.
1. Wait a few minutes for deployment.
1. Select **Chat with agent** when the deployment completes.

## Verify it works

Ask your agent a question to confirm it can see your resources.

```text
What Azure resources can you see?
```

You should see a summary like "I found 251 resources across 3 resource groups, including 5 Container Apps, 2 AKS clusters..."

Your agent also shows:

- A **resource groups table** with monitored groups
- **Resource analysis** by type
- **Suggested prompts** tailored to your resources

## Summary

Your agent now has read access to resources in your selected resource groups, can query Azure Monitor logs and metrics for those resources, and is ready to answer questions about your infrastructure.

## Alternative: Subscription-level access

If you skipped the resource group selection step or want broader access than individual resource groups, you can grant the agent **Reader** access on your entire subscription.

1. Go to **Settings** > **Basics** in your agent.
1. Select the **Managed identity** link to open it in the Azure portal.
1. Navigate to your subscription's **Access control (IAM)**.
1. Add a **Reader** role assignment for the agent's managed identity.

This approach gives the agent visibility into all resources in the subscription without selecting individual resource groups.

## Next step

> [!div class="nextstepaction"]
> [Step 2: Add your team's knowledge](./first-value.md)

## Related content

- [Permissions and roles](permissions.md): Detailed permission model
- [User roles](user-roles.md): Who can access your agent and what they can do
- [Run modes](run-modes.md): Control how much autonomy your agent has
- [Supported regions](supported-regions.md): Full list of available regions
- [Azure observability diagnostics](diagnose-azure-observability.md): What your agent can do with Azure access
