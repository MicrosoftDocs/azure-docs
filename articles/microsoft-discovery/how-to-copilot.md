---
ms.service: azure
ms.author: surmb
author: surajmb
title: Use GitHub Copilot in Microsoft Discovery
description: Learn how to enable and use GitHub Copilot within the Microsoft Discovery Studio preview experience for AI-assisted scientific research.
ms.topic: how-to
ms.date: 06/05/2026
---


# Use GitHub Copilot in Microsoft Discovery

The [Microsoft Discovery Studio preview experience](/azure/microsoft-discovery/concept-studio) now includes integrated support for **GitHub Copilot**, giving you AI-assisted orchestration of Microsoft Discovery agents, compute jobs, and research workflows directly within the preview experience.

> [!IMPORTANT]
> GitHub Copilot in Microsoft Discovery is currently in **preview**. You need a GitHub account to use AI features with GitHub-hosted models.

## Prerequisites

- An Azure subscription with access to [Microsoft Discovery](overview-what-is-microsoft-discovery.md)
- A [Microsoft Discovery workspace](/azure/microsoft-discovery/quickstart-infrastructure-portal#4-create-a-workspace)
- A GitHub account (required for GitHub Copilot features)
- **Microsoft Discovery Platform Administrator** role assignment to manage workspace tags in the Azure portal

## Security considerations

GitHub Copilot integration affects your Microsoft Discovery workspace's security posture. Review the [Microsoft Discovery network security concepts](concept-network-security.md) to understand how enabling GitHub Copilot affects data access and connectivity.

Administrators can enforce feature availability by using **Azure Policy** at the subscription level to maintain organizational control. To learn more, see [build policies to enforce compliance](https://learn.microsoft.com/azure/governance/policy/tutorials/create-and-manage).

## Enable GitHub Copilot for a workspace

GitHub Copilot is **disabled by default** for all workspaces. Enable it through resource tags on the workspace, which gives you granular control over which workspaces have GitHub Copilot AI features activated.

The following tags control feature availability:

| Tag | Description | Default |
|-----|-------------|---------|
| `discovery.workbench.enableGhcpAiFeatures` | Enables GitHub Copilot and AI features | `false` |
| `discovery.workbench.enableExtensions` | Enables the VS Code Extension Marketplace | `false` |

### Steps to enable

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to your Microsoft Discovery workspace resource. You can [create a new workspace](/azure/microsoft-discovery/quickstart-infrastructure-portal#4-create-a-workspace) or search for an existing one.
3. On the workspace **Overview** page, select **Tags** > **Edit**.
4. Add the following tag:
   - **Name:** `discovery.workbench.enableGhcpAiFeatures`
   - **Value:** `true`
5. (Optional) To enable the Extension Marketplace, add an extra tag:
   - **Name:** `discovery.workbench.enableExtensions`
   - **Value:** `true`
6. Select **Save**.

   :::image type="content" source="media/how-to-copilot/workspace-create-tags.jpg" alt-text="Screenshot showing the workspace create page in Azure portal with the tags highlighted." lightbox="media/how-to-copilot/workspace-create-tags.jpg":::

## Open the preview experience with GitHub Copilot

> [!NOTE]
> - **For public access:** You need to recreate the workspace with the tag `NetworkIsolation` set to `false`. This setting enables public access to the workbench and other managed resource group (MRG) resources.
> - **For private access:** You need to be connected on a VPN to the virtual network where the workspace is deployed.

After enabling the tags, open the preview experience from Microsoft Discovery Studio:

1. Go to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com).
2. Select the **Workspaces** tab and open the workspace where you enabled GitHub Copilot. Or select **Projects** tab to list all projects.
3. [Create a new project](/azure/microsoft-discovery/quickstart-infrastructure-portal#9-create-a-project) or select an existing project.
4. Select the **...** (more actions) menu on the project.
5. Select **Open in preview experience**.

   :::image type="content" source="media/how-to-copilot/open-preview-experience.jpg" alt-text="Screenshot showing the project list page with option to open project in preview experience." lightbox="media/how-to-copilot/open-preview-experience.jpg":::

The VS Code environment opens with GitHub Copilot enabled and full Microsoft Discovery capabilities available.

   :::image type="content" source="media/how-to-copilot/preview-experience-home.jpg" alt-text="Screenshot showing the project home page in preview experience." lightbox="media/how-to-copilot/preview-experience-home.jpg":::

## What you can do with GitHub Copilot in Microsoft Discovery

Once the preview experience is open, you can use GitHub Copilot to:

- **Ask scientific questions** — Copilot routes your queries to the appropriate Microsoft Discovery Foundry agent (chemistry, biology, physics, and more).
- **Manage Microsoft Discovery resources** — Create and configure workspaces, projects, agents, knowledge bases, and compute jobs through natural language.
- **Run compute jobs** — Submit tool runs to Microsoft Discovery supercomputers and monitor their progress.
- **Conduct autonomous research** — Create tasks and start the Microsoft Discovery Engine for deep, long-running scientific investigations (requires enabling the `discovery-platform` MCP server).

### Built-in skills

The preview experience includes built-in skills optimized for Microsoft Discovery workflows. These skills provide guided, step-by-step orchestration for common research tasks like invoking agents, creating shared sessions, and managing the Microsoft Discovery Engine.

## Data privacy and sharing

### Private to you

The following are private to each user per workspace and cannot be shared with other users:

- Preview experience session state
- Files stored in your file explorer

Files persist in your Microsoft Discovery workspace's managed resource group across sessions.

### Shared across the project

All users within the same project and workspace can access the following resources:

- Shared sessions (investigations) and their chat history
- Storage containers and storage assets
- Foundry agents
- Tools
- Knowledge bases

> [!NOTE]
> You can continue to access shared sessions through the Microsoft Discovery Studio UI alongside GitHub Copilot. Use Copilot as the orchestrator for your Foundry agents to combine the interactive UI experience with AI-powered automation.

## Related content

- [Microsoft Discovery overview](overview-what-is-microsoft-discovery.md)
- [Create Microsoft Discovery infrastructure](/azure/microsoft-discovery/quickstart-infrastructure-portal)
- [Microsoft Discovery network security](/azure/microsoft-discovery/concept-network-security)
