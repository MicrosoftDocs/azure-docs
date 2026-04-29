---
title: Connect source code to Azure SRE Agent
description: Connect a GitHub or Azure DevOps repository so your agent performs root cause analysis and correlates production issues to specific code changes.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/02/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: source code, github, azure devops, root cause analysis, connectors, getting started
#customer intent: As a site reliability engineer, I want to connect my source code repository so that my agent can correlate production issues to specific code changes during investigations.
---

# Step 3: Connect source code in Azure SRE Agent

Connect your GitHub or Azure DevOps repository. Your agent can now perform **root cause analysis** by correlating production problems to specific code.

## What you accomplish

By the end of this step, your agent:
- Analyzes source code during investigations
- Provides **file:line references** for problems
- Creates To-Do Plans that show investigation steps
- Correlates production symptoms to code changes

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **Agent created** | Complete [Step 1](overview.md) first |
| **GitHub or Azure DevOps account** | Access to the repositories you want to connect |

---

## Choose your authentication method

| Method | When to use |
|--------|-------------|
| **OAuth** | Sign in with your GitHub account. No token needed and the easiest setup. |
| **PAT** | Provide a Personal Access Token with `repo` scope. Works for orgs with SSO restrictions. |

## Connect your repository

Connect a GitHub repository so your agent can index it as a knowledge source. The dialog shows a browsable list of your repositories. Select from the dropdown instead of typing URLs manually.

### Step 1: Open the Add Repository dialog

During onboarding, select the **Add repository** card in the Knowledge Base step.

For an existing agent, go to **Builder** > **Knowledge base** and select the **Add repository** action card.

### Step 2: Choose a platform

1. Select **GitHub** or **Azure DevOps**.

1. Choose your sign-in method:

    | Method | When to use |
    |--------|-------------|
    | **Auth** (OAuth) | Sign in with your GitHub or Azure DevOps account. No token needed. |
    | **PAT** | Provide a Personal Access Token with `repo` scope |

1. Complete authentication:

    - **OAuth:** Select **Sign in to GitHub** or **Sign in to Azure DevOps** and complete the authentication process.
    - **PAT:** Enter your token in the **Provide PAT** field and select **Connect**.

    > [!NOTE]
    > If the sign-in dialog doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

1. Confirm the result: a **Connected** card appears showing your authenticated account.

1. Select **Next**.

### Step 3: Select repositories

After authentication, the **Repository URL** field shows a dropdown of your repositories:

- **GitHub repos** appear as `org/repo-name`, sorted alphabetically (up to 100 repos).

- **Azure DevOps repos** appear after you select a project from the **Azure DevOps Project** dropdown, sorted alphabetically.

Select a repository from the dropdown. The **Display name** autocompletes with the repository name. You can also type any valid repository URL directly into the field.

To add multiple repositories, select **Add** to insert more rows.

> [!TIP]
> The dropdown allows freeform typing. If your repository doesn't appear in the list (for example, if you have more than 100 repos), type the full URL directly.

### Step 4: Confirm and save

Select **Add repository** to save.

The system automatically creates the appropriate GitHub OAuth or Azure DevOps OAuth connector if one doesn't already exist.

### Step 5: Try creating a pull request (preview)

With your repository connected, your agent can now create pull requests directly from chat.

1. Open a chat thread with your agent.

1. Type a prompt like: *"Create a PR in https://github.com/OWNER/REPO from fix/my-branch to main titled 'Fix connection timeout'"*.

1. In Review mode, select **Continue** to approve the PR creation.

Your agent returns a tool card with a clickable link to the created PR.

> [!NOTE]
> Create pull requests requires Review or Autonomous run mode. The source branch must already exist with your changes committed.

## Manage connected repositories

When you reopen the **Add Repository** dialog, existing connected repositories appear as read-only rows in the grid.

**To remove a repository:**

Use the following steps to remove a connected repository.

1. Go to **Builder** > **Knowledge base** and select the **Add repository** action card.

1. Find the repository row in the grid.

1. Select the **trash icon** on the row to mark it for deletion.

1. Select **Add repository** to save changes.

1. A **Confirm changes** dialog appears listing the repositories that are removed.

1. Select **Confirm** to proceed or **Cancel** to keep them.

**To update authentication:** If your PAT expires or you need to switch accounts, reopen the **Add Repository** dialog and re-authenticate with new credentials.

---

## Alternative: MCP + custom agent

To get full GitHub API access (search code, read files, and list commits across all repositories), connect GitHub as an MCP server with a dedicated custom agent.

This approach uses the Model Context Protocol (MCP) to connect GitHub tools to a custom agent. Follow the step-by-step tutorial, [Set Up MCP Connector](mcp-connector.md).

Your agent now analyzes source code during investigations, provides file and line references for problems, creates To-do Plans showing investigation steps, correlates production symptoms to code changes, and can create pull requests in connected repos directly from chat.

## What you learned

- Your agent now analyzes source code during investigations.
- It provides file and line references for problems.
- It creates To-Do Plans that show investigation steps.
- It correlates production symptoms to code changes.

---

## Related content

| Resource | Description |
|----------|-------------------|
| [Root cause analysis](root-cause-analysis.md) | How your agent uses source code to find root causes. |
| [Deep investigation](deep-investigation.md) | Extended multihypothesis analysis using connected repos. |
| [Agent Playground](agent-playground.md) | Test MCP tools and custom agents interactively. |
| [Custom agents](sub-agents.md) | How custom agents extend your agent's capabilities. |
| [Connectors](connectors.md) | All connector types and how they work. |
