---
title: GitHub connector in Azure SRE Agent
description: Connect GitHub repositories for source code analysis, issue management, and workflow automation with OAuth or PAT authentication.
ms.topic: conceptual
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to understand the GitHub connector capabilities so that I can decide which authentication method to use and what my agent can do with my GitHub repositories.
---

# GitHub connector in Azure SRE Agent

Connect your GitHub repositories so your agent can read source code, search for errors, create issues, trigger workflows, and correlate deployments with incidents.

> [!TIP]
> **Quick overview**
>
> - Two auth options: **OAuth sign-in** (recommended) or **Personal Access Token (PAT)**.
> - Your agent gets read access to your repositories, including code search, file contents, and commit history.
> - Your agent can create GitHub Issues, comment on PRs, and trigger GitHub Actions workflows.
> - One OAuth connector per agent covers all repos you have access to.

## Authentication types

Choose the authentication method that fits your team's needs.

| Method | How it works | Best for |
|---|---|---|
| **OAuth** | Sign in with your GitHub account in a browser popup. The agent accesses repos through your permissions. Tokens refresh automatically with no reauthentication needed. | The interactive setup is recommended for most users |
| **PAT** | Provide a Personal Access Token with `repo` scope. Use by CLI (`srectl repo add github --pat`) or when OAuth isn't available. | CI/CD pipelines, headless environments |

> [!TIP]
> **OAuth tokens refresh automatically**
>
> GitHub OAuth tokens expire after approximately eight hours, but your agent refreshes them automatically before expiration using a 5-minute buffer. Each refresh generates a new refresh token, creating a self-sustaining renewal chain that lasts approximately six months. Your connector stays connected through long investigations and overnight scheduled tasks with no manual sign-in required.
>
> **When you need to re-authenticate:** If the refresh token expires (approximately six months), if you revoke the GitHub App authorization, or if you set up your connector before version 26.2.247.0. One one reauthentication stores the refresh token and enables autorefresh going forward.

## What the agent can do with GitHub

The GitHub connector gives your agent capabilities across source code analysis, issue and pull request management, and workflow automation.

### Source code analysis

Your agent can perform the following source code operations:

- **Search code** across all connected repositories.
- **Read file contents** by path and branch.
- **Correlate errors with source code**: Map Azure resource errors to specific files and line numbers.
- **Semantic code search**: Find code related to an incident using natural language queries.
- **Identify IaC files**: Detect Bicep, Terraform, and ARM templates in your repos.

### Issue and pull request management

Your agent can manage issues and pull requests in your connected repositories.

- **Create issues** with title, body, labels, and assignees.
- **Comment on issues and pull requests** including auto-close keywords.
- **Update issues** by changing title, body, labels, or state.
- **Fetch Dependabot alerts** which allows you to review security vulnerabilities.

### Workflow automation

Your agent can trigger and monitor GitHub Actions workflows.

- **Trigger GitHub Actions workflows** which dispatch canary or production deployments.
- **Track workflow runs** that monitor the status of dispatched workflows.
- **Check PR merge status** to verify if a pull request is merged.

## Get started

Use the following resource to set up your GitHub connector.

| Resource | What you learn |
|---|---|
| [Connect source code](connect-source-code.md) | Step-by-step guide for connecting GitHub repositories with OAuth, PAT, or MCP |

## Next step

> [!div class="nextstepaction"]
> [Connect source code](connect-source-code.md)

## Related content

- [Root cause analysis](root-cause-analysis.md): How source code context improves investigation accuracy.
- [Tools](tools.md): File operations and code execution in the agent's workspace.
- [Set up an MCP connector](mcp-connector.md): Connect the GitHub MCP server for more tool capabilities.
- [Connectors](connectors.md): Overview of all connector types.
