---
title: Remove Resources from Agent Scope in Azure SRE Agent
description: Learn how to select and delete configured resources from your Azure SRE Agent scope.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: delete, remove, configuration, scope, resources, cleanup
---

# Remove resources from agent scope in Azure SRE Agent

Select and remove configured resources directly from the agent configuration overview without using the setup wizard. This process works for code repositories, log connectors, deployment connectors, Azure subscriptions, and resource groups.

> [!TIP]
> - Select and remove configured resources directly from the agent configuration overview
> - When you remove subscriptions or resource groups, the agent automatically revokes its managed identity permissions
> - No need to re-enter the full setup wizard to clean up stale resources

## The problem

As your infrastructure evolves, your agent's scope needs to evolve with it. Repositories get archived, connectors point to decommissioned services, and subscriptions shift between teams. Previously, removing a resource from your agent's monitoring scope meant re-entering the full setup wizard.

## Prerequisites

- An Azure SRE Agent with at least one configured resource (repository, connector, subscription, or resource group)
- Contributor or Owner role on the agent resource

## How removing resources works

Each resource grid in the configuration overview includes checkboxes for selection and a **Delete** button that appears when you select one or more items.

1. **Open the configuration overview.** From your agent's overview page, select **Expand** on the configuration status bar to see your configured resources organized by category.

1. **Select items to remove.** Each resource row has a checkbox. Select individual items or use the header checkbox to select all items in a category.

1. **Select Delete.** A **Delete** button with a trash icon appears next to the category header when you select items. A confirmation dialog titled **Remove from scope** appears, warning that permissions on those resources are revoked. Select **Remove** to confirm or **Cancel** to keep the resources.

1. **Resources are removed immediately.** The grid refreshes and the deleted items disappear. For Azure subscriptions and resource groups, the agent also revokes its managed identity role assignments on those resources.

### What you can remove

| Resource type | What happens on removal |
|--------------|------------------------|
| Code repositories | Repository disconnects from the agent's knowledge graph |
| Log connectors | Agent loses access to log querying tools for that connector |
| Deployment connectors | Agent loses access to deployment history from that connector |
| Azure subscriptions | Subscription removed from monitored scope; managed identity permissions revoked |
| Resource groups | Resource group removed from monitored scope; managed identity permissions revoked |

> [!WARNING]
> Removal can't be undone. To restore a removed resource, re-add it through the setup wizard. You can't remove knowledge files from the configuration overview. Use the full setup wizard to manage them.

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Removing a resource** | Re-enter the full setup wizard | Select and delete from the overview |
| **Stale connectors** | Visible but no way to remove without the wizard | Select, delete, done |
| **Orphaned permissions** | Agent keeps permissions on removed subscriptions | Managed identity permissions automatically revoked |

## Related content

- [Favorites and Mine filter](favorites-mine-filter.md)
- [Agent playground](agent-playground.md)
