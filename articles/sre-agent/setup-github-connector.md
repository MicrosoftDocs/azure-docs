---
title: Set up GitHub connector (OAuth or PAT) in Azure SRE Agent
description: Configure the GitHub connector for github.com using OAuth or PAT authentication to enable issue, PR, and workflow operations.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/02/2026
author: dchelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to set up the GitHub connector with OAuth or PAT so that my agent can manage issues, PRs, and workflows.
---

# Set up GitHub connector (OAuth or PAT) in Azure SRE Agent

Use the GitHub connector to connect `github.com` to your agent for managing issues, pull requests, and workflows. Configure the connector through **Builder > Connectors** in the portal.

> [!NOTE]
> This tutorial covers the GitHub Connector for issue, PR, and workflow operations. For code context during investigations, see [Connect source code](connect-source-code.md). For GitHub Enterprise Cloud, see [Connect GitHub Enterprise Cloud](connect-github-enterprise-cloud.md).

## Prerequisites

- An active agent in **Running** state
- Access to `github.com` repositories you want the agent to use
- Agent role: **Administrator** or **Standard User**

## Open the GitHub connector setup

1. Open your agent in the portal.
1. Go to **Builder > Connectors**.
1. Select **Add connector**.
1. Select **GitHub OAuth connector**.

## Choose an authentication method

Choose one method:

| Method | When to use |
|---|---|
| OAuth | Interactive setup for user-driven access |
| PAT | Service account or non-interactive setup |

### OAuth flow

1. Select **OAuth**.
1. Select **Sign in to GitHub**.
1. Complete the GitHub popup authorization.
1. Confirm status shows **Connected**.

### PAT flow

1. Select **PAT**.
1. Paste a GitHub token with required scopes.
1. Select **Connect**.
1. Confirm status shows **Connected**.

## Confirm GitHub connector runtime operations

After saving the connector, test with a chat prompt:

```text
List recent issues from owner/repo and summarize the top 3 risks.
```

Use a direct verification prompt as a final checkpoint:

```text
Get me recent issues from owner/repo.
```

## Required permissions by operation

| Operation | OAuth/PAT minimum |
|---|---|
| Read repository metadata/content | `repo` for private repos (`public_repo` for public-only) |
| List or create issues | Issue-capable repo access |
| Pull request operations | PR-capable repo access |

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Connector shows disconnected | Token expired or revoked | Re-authenticate OAuth or rotate PAT |
| Issue reads work, PR actions fail | Missing PR permission | Grant PR permission and retry |
| Connector can't access private repos | Token scope too narrow | Use `repo` scope for private repos |
| Popup doesn't open | Browser popup blocked | Allow popups for the portal domain |

## Related content

- [GitHub connector](github-connector.md)
- [Connect GitHub Enterprise Cloud](connect-github-enterprise-cloud.md)
- [Connect source code](connect-source-code.md)
- [Set up an MCP connector](mcp-connector.md)

## Next step

> [!div class="nextstepaction"]
> [Connect source code](connect-source-code.md)
