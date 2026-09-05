---
title: User Roles and Permissions in Azure SRE Agent
description: Learn how to control who can view, interact with, and administer your agent by using Azure RBAC roles and layered access control.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 08/21/2026
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
| --- | --- | --- |
| **User roles** (this page) | What *users* can do with the agent | Azure IAM on the agent resource |
| **[Run modes](run-modes.md)** | Whether the agent asks before acting | Per response plan and per scheduled task |
| **[Agent permissions](permissions.md)** | What *the agent* can access on Azure, with on-behalf-of (OBO) authorization as a fallback | RBAC roles on resource groups |

## Four built-in roles

| Role | Can do | Can't do |
| --- | --- | --- |
| **SRE Agent Reader** | View threads, logs, incidents | Chat, request actions, modify anything |
| **SRE Agent Standard User** | Chat, run diagnostics, request actions, manage scheduled tasks, upload knowledge documents, add code repository connectors | Approve actions, create custom agents, delete resources |
| **SRE Agent Author** | Create custom agents, author response plans, configure incident management | Chat, approve actions, upload knowledge documents, add code repository connectors, create scheduled tasks, delete resources |
| **SRE Agent Administrator** | Approve actions, manage connectors, delete resources | — |

The user who creates the agent automatically receives the **SRE Agent Administrator** role.

> [!CAUTION]
> The SRE Agent Author role alone can't add repositories or upload knowledge in the portal. These operations require the `Microsoft.App/agents/memory/write` data action, which the Author role doesn't include. The Author role also doesn't include `threads/write`, so an Author can't chat.
>
> To customize the agent and connect repositories or upload knowledge, assign both **SRE Agent Standard User** and **SRE Agent Author**, or assign **SRE Agent Administrator**. Azure Owner and Contributor roles don't replace these roles because they grant control-plane actions, not SRE Agent data actions.

> [!NOTE]
> You can also manage repository and GitHub credential resources through the Azure Resource Manager (ARM) extension paths under `Microsoft.App/agents/{agent}/repositories` and `Microsoft.App/agents/{agent}/githubAuths`. These paths use `extendedAgents` permissions, which the Author role includes. As a result, an operation can succeed through ARM but fail in the portal for an Author. Assign **SRE Agent Standard User** when the user needs the supported portal workflow.

## Who should have which role?

| Role | Give to |
| --- | --- |
| **SRE Agent Reader** | Auditors, compliance teams, stakeholders who need visibility |
| **SRE Agent Standard User** | L1/L2 engineers, first responders, anyone who diagnoses issues |
| **SRE Agent Author** | SRE engineers who create custom agents, response plan authors, team members who customize agent behavior |
| **SRE Agent Administrator** | SRE managers, cloud admins, incident commanders |

## How the portal enforces permissions

The portal checks your Azure role assignments when you access the agent. Access is enforced at two levels.

### No agent access

When you have no SRE Agent role assignment, the portal shows an **Access Required** screen with a shield icon and a **Go to Access Control** button that opens the Azure IAM blade. If you have Azure Owner or Contributor on the resource, you also see a banner offering to auto-assign the Administrator role.

### Backend enforcement

When you have an SRE Agent role but attempt an action beyond your permissions, the **backend blocks the action with a 403 error**. For example, a Reader can't send a message, a Standard User can't create a custom agent, and an Author can't approve an action or add a repository connector in the portal. The portal might let you navigate to a page or select a button, but the operation fails when it reaches the server. The 403 response might have an empty body, so verify the user's SRE Agent role before troubleshooting Key Vault, ARM, or networking.

> [!NOTE]
> Some portal features proactively disable buttons when you lack write permissions. However, this isn't yet consistent across all features—the backend always enforces the correct permissions regardless of what the UI shows.

## What each role can access

| Area | Reader | Standard User | Author | Administrator |
| --- | --- | --- | --- | --- |
| **Chat** | View threads (read-only) | Send messages, start threads | View threads (read-only) | Full access, approve actions, delete threads |
| **Agent Canvas** | View custom agents | View custom agents | Create, edit, delete custom agents | Create, edit, delete custom agents |
| **Knowledge base** | Browse documents | Browse + upload documents | Browse documents | Upload + delete documents |
| **Code repository connectors** | View connectors | View + add, edit connectors | View connectors | Add, edit, delete connectors |
| **Response plans** | View plans | View plans | Create, edit, delete plans | Create, edit, delete plans |
| **Managed resources** | View resources | View resources | View resources | Add, remove resources |
| **Scheduled tasks** | — | Create, edit, delete tasks | — | Create, edit, delete tasks |
| **Settings** | View settings | View settings | View settings | Modify settings, stop or delete agent |

## Assign roles

Assign roles through the Azure portal (**Access control (IAM)** > **Add role assignment**) or Azure CLI:

```azurecli
az role assignment create \
  --assignee user@company.com \
  --role "SRE Agent Administrator" \
  --scope <agent-resource-id>
```

Replace the role name with `SRE Agent Author`, `SRE Agent Standard User`, or `SRE Agent Reader` as needed.

To find the agent resource ID, run:

```azurecli
az resource show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <AGENT_NAME> \
  --resource-type Microsoft.App/agents \
  --query id -o tsv
```

## How roles work together

| Step | Who | Action |
| --- | --- | --- |
| 1 | Engineer (Standard User) | "Fix the config issue" |
| 2 | Author | Builds a custom agent with a response plan for configuration fixes |
| 3 | Agent | Drafts a remediation plan |
| 4 | Agent | Can't execute because the action requires Administrator approval |
| 5 | Manager (Administrator) | Reviews and approves |
| 6 | Agent | Executes the fix by using its managed identity or OBO authorization |

## Related content

- [Run modes](run-modes.md)
- [Agent permissions](permissions.md)
- [Agent identity](agent-identity.md)
- [Audit agent actions](audit-agent-actions.md)
