---
title: Connect source code to Azure SRE Agent
description: Connect a GitHub or Azure DevOps repository so your agent performs root cause analysis and correlates production issues to specific code changes.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: source code, github, azure devops, root cause analysis, connectors, getting started
#customer intent: As a site reliability engineer, I want to connect my source code repository so that my agent can correlate production issues to specific code changes during investigations.
---

# Connect source code to Azure SRE Agent

**Estimated time**: 10 minutes

Connect your GitHub or Azure DevOps repository so your agent can perform root cause analysis, correlating production issues to specific code.

## What you accomplish

By the end of this tutorial, your agent can:

- Analyze source code during investigations
- Provide specific file and line references for problems
- Create To-do Plans showing investigation steps
- Correlate production symptoms to code changes

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create an agent](create-agent.md) first. |
| **GitHub or Azure DevOps organization** | Access to the repositories you want to connect. |

## Choose your authentication method

Select the authentication method that works best for your environment.

| Method | When to use |
|---|---|
| **OAuth** | Sign in with your GitHub account. No token needed and provides the easiest setup. |
| **PAT** | Provide a Personal Access Token with `repo` scope. Works for organizations with SSO restrictions. |

## Connect your repository

Connect a GitHub or Azure DevOps repository so your agent indexes it as a knowledge source. The dialog shows a browsable list of your repositories. Select from the dropdown instead of typing URLs manually.

### Step 1: Open the Add Repository dialog

During onboarding, select the **Add repository** card in the Knowledge Base step.

For an existing agent, go to **Builder** > **Knowledge settings** and select the **Add repository** action card.

### Step 2: Choose a platform

Use the following steps to select your platform and authenticate.

1. Select **GitHub** or **Azure DevOps**.
1. Choose your sign-in method:

    | Method | When to use |
    |---|---|
    | **Auth** (OAuth) | Sign in with your GitHub or Azure DevOps organization. No token needed. |
    | **PAT** | Provide a Personal Access Token with `repo` scope. |

1. Complete authentication:
   - **OAuth:** Select **Sign in to GitHub** (or **Sign in to Azure DevOps**) and complete the authentication popup.
   - **PAT:** Enter your token in the **Provide PAT** field and select **Connect**.

    > [!NOTE]
    > If the sign-in dialog doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

1. On success, a **Connected** card appears showing your authenticated account.

1. Select **Next**.

### Step 3: Select repositories

After authentication, the **Repository URL** field shows a dropdown of your repositories.

- **GitHub repos** appear as `org/repo-name`, sorted by last updated (up to 100 repos).
- **Azure DevOps repos** appear after you select a project from the **Azure DevOps Project** dropdown.

Select a repository from the dropdown. The **Display name** autofills with the repository name. You can also type any valid repository URL directly into the field.

To add multiple repositories, select **Add** to insert more rows.

> [!TIP]
> The dropdown allows freeform typing. If your repository doesn't appear in the list (for example, if you have more than 100 repos), type the full URL directly.

### Step 4: Confirm and save

Select **Add repository** to save your changes.

The system automatically creates the appropriate GitHub OAuth or Azure DevOps OAuth connector if one doesn't already exist.

## Manage connected repositories

When you reopen the Add Repository dialog, existing connected repositories appear as read-only rows in the grid.

### Remove a repository

Use the following steps to remove a connected repository.

1. Go to **Builder** > **Knowledge settings** and select the **Add repository** action card.
1. Find the repository row in the grid.
1. Select the **trash icon** on the row to mark it for deletion.
1. Select **Add repository** to save changes.
1. In the **Confirm changes** dialog, review the repositories that are removed.
1. Select **Confirm** to proceed or **Cancel** to keep them.

### Update authentication

If your PAT expires or you need to switch accounts, reopen the Add Repository dialog and reauthenticate with new credentials.

## Alternative: MCP and custom agent

For full GitHub API access—search code, read files, list commits across all repositories—connect GitHub as an MCP server with a dedicated custom agent.

This approach uses the Model Context Protocol (MCP) to connect GitHub tools to a custom agent. For step-by-step instructions, see [Tutorial: Set up the MCP connector](mcp-connector.md).

## Summary

Your agent now analyzes source code during investigations, provides file and line references for problems, creates To-do Plans showing investigation steps, and correlates production symptoms to code changes.

## Next step

> [!div class="nextstepaction"]
> [Step 4: Set up incident response](incident-response.md)

## Related content

- [Root cause analysis](root-cause-analysis.md)
- [Deep investigation](deep-investigation.md)
- [Tutorial: Deep investigation](tutorial-deep-investigation.md)
- [Connect knowledge](connect-knowledge.md)
- [Subagents](sub-agents.md)
- [Connectors](connectors.md)
