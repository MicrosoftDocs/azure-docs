---
title: "Step 3: Connect Source Code to Azure SRE Agent"
description: Connect your GitHub repository so your agent can perform root cause analysis and correlate production issues to specific code changes.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: source code, github, root cause analysis, connectors, getting started
#customer intent: As a site reliability engineer, I want to connect my source code repository so that my agent can correlate production issues to specific code changes during investigations.
---

# Step 3: Connect source code to Azure SRE Agent
**Estimated time**: 10 minutes

Connect your GitHub repository so your agent can perform root cause analysis, correlating production problems to specific code.

## What you accomplish

By the end of this step, your agent can:

- Analyze source code during investigations
- Provide specific file and line references for problems
- Create To-Do Plans showing investigation steps
- Correlate production symptoms to code changes

## Prerequisites

| Requirement | Details |
|---|---|
| **Agent created** | Complete [Step 1: Create an agent](create-agent.md) first. |
| **GitHub PAT** | Personal Access Token with `repo` scope. |

## Choose your approach

You can connect source code in three ways.

| Approach | Best for |
|---|---|
| **Option A: Resource mapping** | Single repo linked to a specific Azure resource |
| **Option B: MCP + subagent** | Access to all your GitHub repos |
| **Option C: ADO Documentation connector** | Azure Repos and wikis as knowledge sources |

> [!TIP]
> Pick the approach that matches your setup. You can use multiple options together.

For **Option C**, see the [ADO Wiki knowledge](azure-devops-wiki-knowledge.md) capability page and the [Connect ADO Wiki tutorial](connect-devops-wiki.md).

## Option A: Resource mapping

Associate a repository with an Azure resource. When your agent investigates that resource, it automatically references the linked code.

### Open resource mapping

1. Select **Monitor** in the left sidebar.
1. Select **Resource mapping**.
1. Find your resource in the list.
1. Select the resource to open its detail view.

### Add a repository

1. Select **Add repository**.
1. Paste your GitHub repository URL (for example, `https://github.com/your-org/your-repo`).
1. Sign in to GitHub if prompted.
1. Select **Add**.

You linked the repository to that Azure resource.

### Verify option A

Ask your agent about the linked resource:

```text
What could cause memory issues in the grocery-store-api container app?
```

You should see the following results:

1. The agent creates a **To-Do Plan** for the investigation.
1. The agent loads the `source_code_analysis` skill.
1. The agent searches through your linked repository.
1. The agent returns findings with specific file and line references.

This screenshot shows a plan the agent creates in preparation for code investigation.

:::image type="content" source="media/connect-source-code/to-do-plan-source-code-investigation.png" alt-text="Screenshot of the agent To-Do Plan for a code investigation.":::

This screenshot shows how the agent analyzes the source code and returns specific file references.

:::image type="content" source="media/connect-source-code/root-cause-source-code-analysis-complete.png" alt-text="Screenshot of the agent analyzing source code and returning file references.":::

## Option B: MCP + subagent

Connect GitHub as an MCP server for full access to GitHub features. This approach requires creating a subagent to use the MCP tools.

### Add the GitHub connector

1. Select **Builder** in the left sidebar.
1. Select **Connectors**.
1. Select **Add connector**.

    :::image type="content" source="media/connect-source-code/connectors-list.png" alt-text="Screenshot of the connectors list.":::

1. Select **GitHub MCP server**.
1. Configure the connection:

    | Field | Value |
    |---|---|
    | **Name** | `my-github` (or a descriptive name) |
    | **Connection type** | Streamable-HTTP (default) |
    | **URL** | `https://api.githubcopilot.com/mcp/` |
    | **Authentication method** | Bearer token |
    | **Personal access token** | Your GitHub PAT with `repo` scope |

1. Select **Next** > **Add connector**.
1. Wait for the status to show **Connected**.

:::image type="content" source="media/connect-source-code/grocery-app-repo-connected.png" alt-text="Screenshot of the GitHub connector showing a connected status.":::

### Create a subagent

MCP tools aren't available on the main agent. You need to create a subagent to use them.

1. Select **Builder** > **Subagent builder**.
1. Select **Create subagent**.
1. Configure the subagent:

    | Field | Value |
    |---|---|
    | **Name** | `github-analyst` |
    | **Description** | Analyzes GitHub repositories for root cause analysis |
    | **Instructions** | You analyze source code to find root causes of production issues. When given a repository and symptoms, search for relevant code and provide file:line references. |

1. In the **Tools** section, select the GitHub MCP tools you need (for example, `search_code`, `get_file_contents`, `list_commits`).
1. Select **Save**.

### Verify Option B

Ask your agent to hand off to your new subagent:

```text
Use the github-analyst subagent to analyze the code in my-org/my-repo for memory leaks.
```

The main agent hands off to your subagent, which uses the GitHub MCP tools to analyze the code.

## The difference source code makes

The following example shows how source code connectivity changes an agent's response.

**Without source code:**

> "The container app is experiencing memory pressure. Consider increasing memory limits."

**With source code:**

> "Found potential memory leak in `src/api/suppliers.js`:
>
> **Line 45-52:** The `fetchSupplierData()` function creates new HTTP clients per request without cleanup.
>
> **Line 110-117:** Rate limiting is set to 5 req/min, but the API shows burst patterns of ~40/min.
>
> **Recommendation:** Add connection pooling or implement client reuse."

Your agent correlates production symptoms to exact code locations.

## Recommended repositories to connect

The following table shows which types of repositories provide the most value.

| Repository type | Value |
|---|---|
| **Production apps** | Root cause analysis during incidents |
| **Infrastructure-as-code** | Configuration drift detection |
| **Runbook scripts** | Understand automation logic |

> [!TIP]
> Connect your most incident-prone application first. Add more repositories later.

## Summary

Your agent now analyzes source code during investigations, provides file and line references for problems, creates To-Do Plans showing investigation steps, and correlates production symptoms to code changes.

## Next step

> [!div class="nextstepaction"]
> [Step 4: Set up incident response](./incident-response.md)

## Related content

- [Root cause analysis](root-cause-analysis.md): How your agent uses source code to find root causes
- [Deep investigation](deep-investigation.md): Extended multi-hypothesis analysis using connected repos
- [Tutorial: Deep investigation](./tutorial-deep-investigation.md): Run a deep investigation with source code
- [Subagents](sub-agents.md): How subagents extend your agent's capabilities
- [Connectors](connectors.md): All connector types and how they work
