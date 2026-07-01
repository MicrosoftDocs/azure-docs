---
title: Manage Permissions for Azure SRE Agent
description: Add or remove managed resource groups, change permission levels, and grant subscription-level access for your Azure SRE Agent.
ms.topic: how-to
ms.date: 03/16/2026
ms.service: azure-sre-agent
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: permissions, managed resources, rbac, reader, contributor, subscription access
#customer intent: As an SRE, I want to manage which Azure resources my agent can access and what it can do with them so that I can control agent behavior as my needs change.
---

# Manage permissions for Azure SRE Agent

After you create your agent, you can control which Azure resources it can access and what actions it can take. Manage access by adding resource groups, setting permission levels, and optionally granting subscription-wide access.

For a full overview of how permissions work, see [Agent permissions](permissions.md).

## Prerequisites

Before you begin, make sure you have the following requirements in place:

- An Azure SRE Agent in **Running** state.
- **Owner** or **User Access Administrator** role on the resource groups you want to assign.
- Access to the Azure portal for subscription-level changes.

## Add managed resource groups

Managed resource groups determine which Azure resources your agent can see during investigations. The agent gets read access to resources in these groups, including logs, metrics, and configurations.

1. Go to **Settings** > **Managed resources** in the left sidebar.
1. Select **Add resource group**.
1. Use the search filter to find resource groups across your subscriptions.
1. Select the groups you want the agent to access.
1. Select **Save**.

To remove a resource group, select it in the list and select **Remove**.

> [!TIP]
> After you save, verify that the resource groups you added appear in the **Managed resources** list.

## Set the permission level

Permission levels control what your agent can do with managed resources. The following table summarizes the available levels:

| Level | What the agent can do | When to use |
|---|---|---|
| **Reader** (default) | Read-only access. Actions require your approval. | Start here for the safest option. |
| **Privileged** | Execute approved actions directly, such as restarting containers or scaling resources. | Use after you trust the agent's behavior. |

To change the permission level:

1. Go to **Settings** > **Managed resources**.
1. Select the resource group.
1. Change the permission level.
1. Select **Save**.

The portal shows which Azure RBAC roles are assigned, such as Log Analytics Reader, Monitoring Reader, and AKS Cluster User, depending on the level.

> [!TIP]
> Use [run modes](run-modes.md) to control whether the agent executes actions automatically or waits for approval, independent of the permission level.

## Grant subscription-level access (optional)

For broader access than individual resource groups provide, grant the agent **Reader** on your entire subscription.

1. Go to **Settings** > **Basics** in your agent.
1. Select the **Managed identity** link to open it in the Azure portal.
1. Navigate to your subscription's **Access control (IAM)**.
1. Select **Add role assignment**.
1. Select the **Reader** role.
1. Assign it to the agent's managed identity.

Subscription-level access gives the agent visibility into all resources in the subscription without adding individual resource groups.

> [!TIP]
> After you save, verify that the role assignment appears in your subscription's **Access control (IAM)** page.

## Verify access

Confirm that the agent can see the resources you assigned.

1. Open a new chat thread.
1. Ask the agent: *"What Azure resources can you see?"*
1. The agent responds with a summary of discovered resources, resource groups, and resource types.

Verify that the agent lists the resource groups and resources you configured in the previous steps.

## Next step

> [!div class="nextstepaction"]
> [Understand agent permissions](./permissions.md)

## Related content

- [Agent permissions](permissions.md)
- [User roles and permissions](user-roles.md)
- [Run modes](run-modes.md)
- [Diagnose with Azure observability](diagnose-azure-observability.md)
