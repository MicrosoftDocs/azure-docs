---
title: User Roles and Permissions in Azure SRE Agent
description: Learn how to control who can view, interact with, and administer your agent by using Azure RBAC roles and layered access control.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/30/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: rbac, roles, permissions, access control, user access, admin, reader, authorization, security
#customer intent: As an SRE or cloud admin, I want to understand user roles so that I can control who can interact with and manage my agent.
---

# User roles and permissions in Azure SRE Agent

Your agent can investigate issues, take actions on production infrastructure, and access sensitive data across your environment. Access control determines who can request actions, who can approve them, and who can modify the agent's configuration.

## Access control overview

Access control works across three layers:

| Layer | Controls | Configured at |
|-------|----------|---------------|
| **User roles** (this page) | What *users* can do with the agent | Azure IAM on the agent resource |
| **[Run modes](run-modes.md)** | Whether the agent asks before acting | Per response plan and per scheduled task |
| **[Agent permissions](permissions.md)** | What *the agent* can access on Azure | RBAC roles on resource groups |

## Three built-in roles

| Role | Can do | Can't do |
|------|--------|-----------|
| **SRE Agent Reader** | View threads, logs, incidents | Chat, request actions, modify anything |
| **SRE Agent Standard User** | Chat, run diagnostics, request actions | Approve actions, delete resources, modify connectors |
| **SRE Agent Administrator** | Approve actions, manage connectors, delete resources | — |

The user who creates the agent automatically receives the **SRE Agent Administrator** role.

## Who should have which role?

| Role | Give to |
|------|---------|
| **SRE Agent Reader** | Auditors, compliance teams, stakeholders who need visibility |
| **SRE Agent Standard User** | L1/L2 engineers, first responders, anyone who diagnoses issues |
| **SRE Agent Administrator** | SRE managers, cloud admins, incident commanders |

## How the portal enforces permissions

The portal checks your Azure role assignments when you access the agent. Access is enforced at two levels.

### No agent access

When you have no SRE Agent role assignment, the portal shows an **Access Required** screen with a shield icon and a **Go to Access Control** button that opens the Azure IAM blade. If you have Azure Owner or Contributor on the resource, you also see a banner offering to auto-assign the Administrator role.

### Backend enforcement

When you have an SRE Agent role but attempt an action beyond your permissions, the **backend blocks the action with a 403 error**. The portal might let you navigate to a page or select a button, but the operation fails with a permission error when it reaches the server.

> [!NOTE]
> Some portal features proactively disable buttons when you lack write permissions. However, this isn't yet consistent across all features—the backend always enforces the correct permissions regardless of what the UI shows.

## What each role can access

| Area | Reader | Standard User | Administrator |
|------|--------|---------------|---------------|
| **Chat** | View threads (read-only) | Send messages, start threads | Full access + approve actions, delete threads |
| **Agent Canvas** | View custom agents | View custom agents | Create, edit, delete custom agents |
| **Knowledge base** | Browse documents | Upload documents | Upload + delete documents |
| **Connectors** | View connectors | View connectors | Add, edit, delete connectors |
| **Response plans** | View plans | View plans | Create, edit, delete plans |
| **Managed resources** | View resources | View resources | Add, remove resources |
| **Settings** | View settings | View settings | Modify settings, stop/delete agent |

## Assign roles

Assign roles through the Azure portal (**Access control (IAM)** > **Add role assignment**) or Azure CLI:

```azurecli
az role assignment create \
  --assignee user@company.com \
  --role "SRE Agent Administrator" \
  --scope <agent-resource-id>
```

Replace the role name with `SRE Agent Standard User` or `SRE Agent Reader` as needed.

## How roles work together

| Step | Who | Action |
|------|-----|--------|
| 1 | Engineer (Standard User) | "Fix the config issue" |
| 2 | Agent | Drafts remediation plan |
| 3 | Agent | Can't execute (needs Administrator approval) |
| 4 | Manager (Administrator) | Reviews and approves |
| 5 | Agent | Executes fix using managed identity |

## Related content

- [Run modes](run-modes.md)
- [Agent permissions](permissions.md)
- [Agent identity](agent-identity.md)
- [Audit agent actions](audit-agent-actions.md)
