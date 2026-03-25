---
title: User Roles and Permissions in Azure SRE Agent
description: Learn how to control who can view, interact with, and administer your agent by using Azure RBAC roles and layered access control.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: rbac, roles, permissions, access control, user access, admin, reader, authorization, security
#customer intent: As an SRE or cloud admin, I want to understand user roles so that I can control who can interact with and manage my agent.
---

# User roles and permissions in Azure SRE Agent
<!-- Video: SRE_Agent__User_Roles.mp4 — Replace with the hosted video URL using > [!VIDEO https://...] syntax -->

Your agent can investigate problems, take actions on production infrastructure, and access sensitive data across your environment. Access control determines who can request actions, who can approve them, and who can modify the agent's configuration.

## Access control overview

Access control works across four layers.

:::image type="content" source="media/user-roles/access-control-hierarchy.svg" alt-text="Diagram of access control hierarchy showing user roles, run modes, agent identity, and on-behalf-of fallback." lightbox="media/user-roles/access-control-hierarchy.svg":::

| Layer | Controls | Configured at |
|---|---|---|
| **User roles** (this article) | What *users* can do with the agent | Azure IAM on the agent resource |
| **[Run modes](run-modes.md)** | Whether the agent asks before acting | Per trigger and per scheduled task |
| **[Agent identity](permissions.md)** | What *the agent* can access on Azure | RBAC roles on resource groups |
| **OBO fallback** | Temporary elevated access | Administrator authorizes on demand |

## Three built-in roles

Your agent includes three built-in Azure RBAC roles.

| Role | Can do | Can't do |
|---|---|---|
| **SRE Agent Reader** | View threads, logs, incidents | Chat, request actions, modify anything |
| **SRE Agent Standard User** | Chat, run diagnostics, request actions | Approve actions, delete resources, modify connectors |
| **SRE Agent Administrator** | Approve actions, manage connectors, delete resources | (Full access) |

The user who creates the agent automatically gets the **SRE Agent Administrator** role.

:::image type="content" source="media/user-roles/portal-sre-agent-roles-identity-access.png" alt-text="Screenshot of SRE Agent roles in Azure portal IAM showing Administrator, Reader, and Standard User." lightbox="media/user-roles/portal-sre-agent-roles-identity-access.png":::

## Who should have which role

Use the following guidance to assign roles based on team responsibilities.

| Role | Give to |
|---|---|
| **SRE Agent Reader** | Auditors, compliance teams, stakeholders who need visibility |
| **SRE Agent Standard User** | L1/L2 engineers, first responders, anyone who diagnoses problems |
| **SRE Agent Administrator** | SRE managers, cloud admins, incident commanders |

## How the portal enforces permissions

The portal checks your Azure role assignments when you access the agent. Access is enforced at two levels.

### Level 1: No agent access

When you don't have the SRE Agent role assignment, the portal shows an **Access Required** screen with a shield icon and a **Go to Access Control** button that opens the Azure IAM blade. If you have Azure Owner or Contributor on the resource, you also see a banner offering to auto-assign the Administrator role.

### Level 2: Backend enforcement

When you have an SRE Agent role but attempt an action beyond your permissions (for example, a Reader trying to send a message, or a Standard User trying to create a subagent), the backend blocks the action with a 403 error. The portal might let you navigate to a page or select a button, but the operation fails with a permission error when it reaches the server.

> [!NOTE]
> Some portal features proactively disable buttons when you lack write permissions (for example, connector management shows disabled buttons with tooltips). However, this behavior isn't yet consistent across all features. The backend always enforces the correct permissions regardless of what the UI shows.

## What each role can access

The following table summarizes the access level for each role across different areas of the portal.

| Area | Reader | Standard User | Administrator |
|---|---|---|---|
| **Chat** | View threads (read-only) | Send messages, start threads | Full access, approve actions, delete threads |
| **Subagent builder** | View subagents | View subagents | Create, edit, delete subagents |
| **Knowledge base** | Browse documents | Upload documents | Upload and delete documents |
| **Connectors** | View connectors | View connectors | Add, edit, delete connectors |
| **Response plans** | View plans | View plans | Create, edit, delete plans |
| **Managed resources** | View resources | View resources | Add, remove resources |
| **Settings** | View settings | View settings | Modify settings, stop/delete agent |

## Assign roles

Assign roles through the Azure portal (**Access control (IAM)** > **Add role assignment**) or by using the Azure CLI.

```azurecli
az role assignment create \
  --assignee user@company.com \
  --role "SRE Agent Administrator" \
  --scope <AGENT_RESOURCE_ID>
```

Replace the role name with `SRE Agent Standard User` or `SRE Agent Reader` as needed.

To find your agent's resource ID, run the following command:

```azurecli
az resource show \
  --resource-group <RESOURCE_GROUP> \
  --name <AGENT_NAME> \
  --resource-type Microsoft.SREAgent/agents \
  --query id -o tsv
```

## How roles work together

The following example shows how roles interact during an action approval workflow. An engineer requests an action, but only administrators can approve it.

| Step | Who | Action |
|---|---|---|
| 1 | Engineer (Standard User) | "Fix the config issue" |
| 2 | Agent | Drafts remediation plan |
| 3 | Agent | Can't execute (needs Administrator approval) |
| 4 | Manager (Administrator) | Reviews and approves |
| 5 | Agent | Executes fix using managed identity or [on-behalf-of](permissions.md#on-behalf-of-obo) authorization |

## User roles vs. agent permissions

User roles and agent permissions control different aspects of access.

| Concept | Controls |
|---|---|
| **User roles and permissions** (this article) | What *users* can do with the agent |
| **[Agent permissions](permissions.md)** | What *the agent* can do on Azure resources |

When an administrator approves an action, the agent uses one of the following methods:

- **Agent's managed identity**: Use this method when the agent has the required Azure RBAC permissions.
- **[On-behalf-of](permissions.md#on-behalf-of-obo) authorization**: Use this method when the agent lacks permissions but the administrator has them.

> [!TIP]
> Only SRE Agent Administrators can authorize on-behalf-of access. Standard Users can't approve actions that require elevated permissions.

## Next step

> [!div class="nextstepaction"]
> [Understand agent permissions](./permissions.md)

## Related content

- [Agent permissions](permissions.md)
- [Run modes](run-modes.md)
