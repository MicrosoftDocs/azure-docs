---
title: GitHub connector in Azure SRE Agent
description: Connect GitHub repositories for source code analysis, issue management, and workflow automation with OAuth or PAT authentication.
ms.topic: article
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: dchelupati
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to understand the GitHub connector capabilities so that I can decide which authentication method to use and what my agent can do with my GitHub repositories.
---

# GitHub connector in Azure SRE Agent

Connect your GitHub repositories so your agent can read source code, search for errors, create issues, trigger workflows, and match deployments with incidents.

> [!TIP]
> **Quick overview**
>
> - **Code Access** gives your agent source code, IaC, and configs as investigation context.
> - **GitHub Connector** enables issue, PR, and workflow operations.
> - **GitHub MCP** provides full GitHub tool access with governance controls.
> - Authenticate with **OAuth**, **PAT**, or **BYO GitHub App** . All three work on `github.com`. GitHub Enterprise Cloud (`<tenant>.ghe.com`) requires BYO App.

Your source code, infrastructure definitions, deployment configs, skills, and runbooks live in GitHub. When your agent can read these artifacts, investigations go from generic troubleshooting to root cause analysis that references the exact file, the exact commit, and the exact config change.

## How your agent uses the GitHub connector

Azure SRE Agent connects to GitHub in three ways, each serving a different purpose:

| Connection type | Where you configure it | What your agent gets |
|---|---|---|
| **Code Access** | Builder > Code Access | Code search, file read by path/branch, error-to-source correlation, semantic code search |
| **GitHub Connector** | Builder > Connectors > Add connector | Create/list issues, open/merge PRs, trigger and track GitHub Actions workflows |
| **GitHub MCP** | Builder > Connectors > Add connector | Full GitHub tool catalog via MCP, with approval policies and tool selection controls |

You can use multiple connection types on the same agent. Each serves a different runtime purpose.

## Authentication methods for the GitHub connector

Separately from what the agent does, choose how it authenticates to GitHub. Three methods are available, and they work across all connection types.

| Auth method | How it works | Supported hosts | Best for |
|---|---|---|---|
| **OAuth** | Sign in with your GitHub account in a browser popup | `github.com` | Quick interactive setup (limit: 10 tokens per agent) |
| **PAT** | Provide a fine-grained Personal Access Token with `repo` scope | `github.com` | Service accounts, non-interactive environments |
| **BYO GitHub App** | Register your own GitHub App, store the private key in Azure Key Vault | `github.com` and `<tenant>.ghe.com` | Enterprise governance, EMU environments, GitHub Enterprise Cloud |

For `github.com`, all three methods work across all connection types. For GitHub Enterprise Cloud hosts (`<tenant>.ghe.com`), only BYO GitHub App is available.

### Permissions by auth type

| Operation | OAuth or PAT minimum | GitHub App minimum |
|---|---|---|
| Repository metadata and clone/read | `repo` for private repos, `public_repo` for public-only access | Repository **Metadata: Read** and **Contents: Read** |
| List/create issues | Issue-capable repo scope for OAuth/PAT | Repository **Issues: Read/Write** as needed |
| Pull request operations | PR-capable repo scope for OAuth/PAT | Repository **Pull requests: Read/Write** as needed |

> [!TIP]
> **OAuth tokens refresh automatically**
>
> GitHub OAuth tokens expire after about eight hours, but the agent refreshes them automatically before expiration by using a 20-minute buffer. Each refresh generates a new refresh token, creating a self-sustaining renewal chain that lasts about six months. Your connector stays connected through long investigations and overnight scheduled tasks without manual sign-in.
>
> This auto-refresh applies to **OAuth connections only**. PAT connections require manual token rotation. For BYO GitHub App connections, rotate the private key in Azure Key Vault when needed.
>
> **When you need to re-authenticate:** If the refresh token expires (about six months), if you revoke the GitHub App authorization, or if your connector was set up before version 26.2.247.0 (one re-auth stores the refresh token and enables auto-refresh going forward).

## What the agent can do with the GitHub connector

### Source code analysis capabilities

- **Search code** across all connected repositories.
- **Read file contents** by path and branch.
- **Correlate errors with source code**: Map Azure resource errors to specific files and line numbers.
- **Semantic code search**: Find code related to an incident using natural language queries.
- **Identify IaC files**: Detect Bicep, Terraform, and ARM templates in your repos.

### Issue and pull request management

- **Create issues** with title, body, labels, and assignees.
- **Comment on issues and pull requests** including auto-close keywords.
- **Update issues** by changing title, body, labels, or state.
- **Fetch Dependabot alerts** to review security vulnerabilities.

### Workflow automation

- **Trigger GitHub Actions workflows** to dispatch canary or production deployments.
- **Track workflow runs** to monitor status of dispatched workflows.
- **Check PR merge status** to verify if a pull request is merged.

## GitHub Enterprise Cloud

Connect repositories hosted on GitHub Enterprise Cloud (`<tenant>.ghe.com`) by using a BYO GitHub App. The agent uses your app's private key, which you store in Azure Key Vault, to create short-lived installation tokens for each repository.

Make sure you have:

- A GitHub App created on your GHE instance with **Contents: Read-only** permission.
- The app's private key stored as a secret in Azure Key Vault.
- The agent's managed identity granted **Key Vault Secrets User** role on the vault.

For the full setup guide, see [Connect GitHub Enterprise Cloud repositories](connect-github-enterprise-cloud.md).

## Configure the same repository in multiple paths

Configure the same repo in multiple GitHub paths. Each path serves different runtime jobs.

| Scenario | Recommended approach |
|---|---|
| Need code context plus issue operations | Configure Code Access and either GitHub Connector or GitHub MCP |
| Need broad MCP tool catalog only | Use GitHub MCP only |
| Need enterprise host (`<tenant>.ghe.com`) | Use GHE BYO App via Code Access |
| Need strict connector contract behavior | Use GitHub Connector |

## Limits and constraints

| Resource | Guidance |
|---|---|
| Hosts | Configure each host independently (`github.com`, `<tenant>.ghe.com`) |
| Auth records | Host-scoped; disconnecting one host doesn't disconnect another |
| GitHub Enterprise Cloud auth | BYO App only |
| Key Vault requirement for BYO App | Private key must be in Key Vault and readable by agent identity |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Code Access repo row shows **Failed**, but issue queries still work | Different endpoint or point-in-time health check failure | Re-test Code Access connection and verify repo metadata permissions |
| BYO App validation fails | Client ID, private key URI, or app installation scope mismatch | Verify Client ID, Key Vault secret content, and app installation scope |
| `<tenant>.ghe.com` host doesn't show OAuth/PAT | Expected behavior | Use BYO GitHub App |
| Clone/read fails after auth succeeds | Missing Metadata/Contents read permissions on app or token | Grant the required repo permissions and retry |
| PR or issue actions fail | Missing issue/PR permissions | Add issue/PR permissions to OAuth/PAT scope or GitHub App |

## Get started with the GitHub connector

| What you want to do | Guide |
|---|---|
| Give your agent code context for investigations (OAuth/PAT) | [Connect source code](connect-source-code.md) |
| Enable issue, PR, and workflow operations (OAuth/PAT) | [Set up GitHub connector](setup-github-connector.md) |
| Set up BYO GitHub App for `github.com` or `<tenant>.ghe.com` | [Connect GitHub Enterprise Cloud](connect-github-enterprise-cloud.md) |
| Add GitHub MCP tools with governance controls | [Set up an MCP connector](mcp-connector.md) |

## Next step

> [!div class="nextstepaction"]
> [Connect source code](connect-source-code.md)

## Related content

- [Root cause analysis](root-cause-analysis.md)
- [Tools](tools.md)
- [Set up an MCP connector](mcp-connector.md)
- [Connectors](connectors.md)
