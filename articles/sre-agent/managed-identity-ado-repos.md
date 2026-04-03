---
title: Managed Identity for Azure DevOps Repositories in Azure SRE Agent
description: Learn how to connect Azure DevOps repositories using managed identity in Azure SRE Agent.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: managed identity, azure devops, ado, repositories, authentication
---

# Managed identity for Azure DevOps repositories in Azure SRE Agent

Connect ADO repos by using your agent's managed identity so you don't need to create or rotate PATs. Credentials never expire as long as identity permissions are maintained.

> [!TIP]
> - Connect ADO repos by using your agent's managed identity without creating or rotating PATs
> - Select system-assigned or user-assigned identity from a dropdown
> - Setup takes about 2 minutes once the managed identity has ADO organization access

## The problem

Connecting Azure DevOps repositories to your SRE Agent requires authentication. The most common approach is creating a Personal Access Token, which involves navigating to ADO user settings, selecting scopes, setting an expiration, copying the token, and pasting it into the agent configuration.

PATs work, but they create operational overhead. Tokens expire every 90 to 365 days. When they do, your agent silently loses access to repositories it depends on for code-aware investigations.

## How managed identity authentication works

When adding an Azure DevOps repository as a knowledge source, you now have three authentication options: **Auth**, **Managed Identity**, and **PAT**.

Selecting Managed Identity displays a dropdown showing your agent's available identities, including system-assigned, user-assigned, or both. Select the identity that has access to your ADO organization, enter the organization name, and save.

### Identity types

| Identity type | When to use |
|--------------|-------------|
| **System-assigned** | Single-org access using the agent's built-in identity |
| **User-assigned** | Multiple agents sharing the same ADO access, or separate identities per purpose |

### Form fields

| Field | Required | Description |
|-------|----------|-------------|
| **Organization** | Yes | Your Azure DevOps organization name |
| **Managed Identity** | Yes | System-assigned or user-assigned identity from the dropdown |
| **Use managed identity as federated identity credential** | No | Enable Federated Identity Credentials for cross-tenant access |
| **Federated client ID** | If FIC enabled | Application (client) ID in the target tenant |
| **Federated tenant ID** | If FIC enabled | Directory (tenant) ID of the target tenant |

## Before and after

| Before (PAT) | After (Managed Identity) |
|--------------|-------------------------|
| Navigate to ADO, create PAT, copy, paste into agent | Select identity from dropdown, Save |
| Set calendar reminder for PAT rotation | No rotation needed |
| PAT expires, agent loses repo access silently | Access persists as long as identity has ADO permissions |
| One PAT per agent per organization | One identity serves all repos in the org |

## Related content

- [Connect knowledge sources](connect-knowledge.md)

## Next step

> [!div class="nextstepaction"]
> [Connect an ADO repository with managed identity](connect-ado-repo-managed-identity.md)
