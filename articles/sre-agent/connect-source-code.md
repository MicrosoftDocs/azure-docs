---
title: Connect source code to Azure SRE Agent
description: Connect a GitHub or Azure DevOps repository so your agent performs root cause analysis and correlates production issues to specific code changes.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 10/28/2026
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
| **GitHub App** | Use an organization-managed app with a Key Vault-backed signing key. Required for `*.ghe.com`. |
| **Managed Identity** | Connect Azure DevOps without a long-lived user credential. |
| **OAuth** | Sign in with your GitHub or Azure DevOps account. |
| **PAT** | Provide a personal access token with the minimum permissions required by the target service. |

## Connect your repository

Connect a GitHub repository so your agent can index it as a knowledge source. The dialog shows a browsable list of your repositories. Select from the dropdown instead of typing URLs manually.

### Step 1: Open the Add Repository dialog

During onboarding, select the **Add repository** card in the Knowledge Base step.

For an existing agent, go to **Build + setup** > **Context** > **Code access**, choose the service tab, and select **Add repository**.

### Step 2: Choose a platform

1. Select **GitHub** or **Azure DevOps**.

1. On the **Connection** step, enter the full **Repository URL** for GitHub, or the **Organization** name for Azure DevOps.
1. Choose an existing connection if one is available, or configure a new connection.
1. Select the authentication method and complete its fields. GitHub offers **OAuth**, **Personal access token (PAT)**, and **Use your GitHub App**. Azure DevOps offers **Your account**, **Managed Identity**, and **PAT**.
1. Complete the sign-in or connection test shown by the selected method. For method-specific instructions, see [Connect a source code service](connect-code-service.md).

    > [!NOTE]
    > If the sign-in dialog doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

1. Confirm the connection succeeds.

1. Select **Next**.

### Step 3: Select repositories

On **Add repositories**, review the initial repository and add more entries as needed. The **Repository URL** field supports repository selection and direct URL entry:

- **GitHub repos** appear as `org/repo-name`, sorted alphabetically (up to 100 repos).

- **Azure DevOps repos** appear after you select a project from the **Azure DevOps Project** dropdown, sorted alphabetically.

Select a repository from the dropdown. The **Display name** autocompletes with the repository name. You can also type any valid repository URL directly into the field.

For GitHub, select **Add repository** to add entries. Expand each entry to edit its **Display name** or use **Add description**. For Azure DevOps, use **Add** and edit those fields in the grid.

> [!TIP]
> The dropdown allows freeform typing. If your repository doesn't appear in the list (for example, if you have more than 100 repos), type the full URL directly.

### Step 4: Confirm and save

Select **Save**. The repositories appear on the **Code access** page with their connection and last-sync information.

### Step 5: Try creating a pull request (preview)

With your repository connected, your agent can now create pull requests directly from chat.

1. Open a chat thread with your agent.
1. Type a prompt like: *"Create a PR in `https://github.com/OWNER/REPO` from fix/my-branch to main titled 'Fix connection timeout'"*.
1. In Review mode, select **Continue** to approve the PR creation.

Your agent returns a tool card with a clickable link to the created PR.

> [!NOTE]
> Create pull requests requires Review or Autonomous run mode. The source branch must already exist with your changes committed.

## Manage connected repositories

The **Code access** page lists connected repositories and their connection names.

**To remove a repository:**

Use the following steps to remove a connected repository.

1. Go to **Build + setup** > **Context** > **Code access**.
1. Select the service tab and the repository's checkbox.
1. Select **Delete** and review the confirmation before proceeding.

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
