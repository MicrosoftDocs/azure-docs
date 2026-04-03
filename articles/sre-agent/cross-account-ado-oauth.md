---
title: Cross-Account Azure DevOps Access in Azure SRE Agent
description: Learn how to connect to Azure DevOps organizations across tenants in Azure SRE Agent.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: azure devops, cross-account, multi-tenant, oauth, repositories
---

# Cross-account Azure DevOps access in Azure SRE Agent

Connect to Azure DevOps organizations in different tenants by signing in with another account. No service principals, PATs, or admin approval needed.

> [!TIP]
> - Connect to Azure DevOps organizations in **different tenants** by signing in with another account
> - A browser popup lets you authenticate without service principals, PATs, or admin approval
> - Your agent gains read access to repositories, pull requests, and code in the connected organization

## The problem: repositories locked behind tenant boundaries

Your incident investigation points to a code change, but the repository lives in an Azure DevOps organization managed by a different team, or even a different Microsoft tenant. Without cross-account access, you'd manually clone the repo, search for the change, and paste findings back into the investigation.

## How cross-account access works

When you add a repository from an Azure DevOps organization in a different tenant, you sign in with the right account through a browser popup:

1. **Open "Add repository"** from your agent's Knowledge sources settings.
1. **Select Azure DevOps** as the platform and choose **Auth** as the authentication method.
1. **Enter the organization name** of the target ADO org.
1. **Select "Sign in to Azure DevOps"**. A confirmation dialog shows the permissions being granted.
1. **Select "Authorize"**. A sign-in popup opens where you select or sign in with the account that has access to the target organization.
1. **Repositories from the other org appear** in the repository picker, sorted alphabetically.

## What makes this different

Unlike Personal Access Tokens (PATs), cross-account OAuth uses your Microsoft identity directly:

- **No tokens to manage**: authenticate once with your account, no PAT generation or rotation
- **User-level permissions**: your access to the ADO organization determines what the agent can read
- **Standard browser auth**: the same sign-in flow you'd use to access ADO directly
- **Persistent connection**: the authorization is stored server-side and used for ongoing access

## When to use cross-account access

| Scenario | Use cross-account? |
|----------|-------------------|
| ADO org in your current tenant | No. Standard ADO connector works |
| ADO org in a different Microsoft tenant | **Yes.** Sign in with your account in that tenant |
| ADO org requiring a different user account | **Yes.** The popup lets you choose any account |
| GitHub repositories (any org) | No. Use the GitHub OAuth connector instead |

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Accessing cross-tenant ADO repos** | Manually clone, search, and relay findings | Sign in once, agent reads directly |
| **Multi-org investigations** | Limited to repos in your primary ADO connection | Span repositories across organizations and tenants |
| **Setup complexity** | Configure service principals or share PATs | Browser sign-in popup, done in seconds |

## Related content

- [Azure DevOps connector](ado-connector.md)
- [Deep investigation](deep-investigation.md)
- [Connect knowledge](connect-knowledge.md)

## Next step

> [!div class="nextstepaction"]
> [Set up cross-account Azure DevOps access](cross-account-azdo-oauth-authorization.md)
