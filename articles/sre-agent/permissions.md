---
title: Agent Permissions in Azure SRE Agent
description: Learn how your agent accesses Azure resources, including permission levels, RBAC roles, and on-behalf-of flow.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: permissions, security, rbac, managed identity, obo, on behalf of, reader, privileged, personal account, microsoft account, msa
#customer intent: As an SRE, I want to understand how my agent authenticates and gets permissions so that I can securely grant it access to my Azure resources.
---

# Agent permissions in Azure SRE Agent
<!-- > [!VIDEO <PATH_TO_VIDEO>/Azure_SRE_Agent_Permissions.mp4] -->

Every agent has a [user-assigned managed identity (UAMI)](/entra/identity/managed-identities-azure-resources/overview) that is automatically created alongside it. Your agent uses this UAMI to authenticate and interact with your Azure resources. It acts on your behalf without you needing to manage secrets or credentials.

## Permission levels

During agent creation, you choose a permission level that determines which RBAC roles get assigned to the UAMI on the resource groups you select.

| Level | What it grants | Best for |
|---|---|---|
| **Reader** | Core monitoring roles + resource-type-specific reader roles | Read-only diagnostics. The agent prompts for temporary elevation (via OBO) when it needs to take action. |
| **Privileged** | Core monitoring roles + resource-type-specific contributor roles | Full operational access. The agent can take approved actions directly. |

### Preconfigured roles (always assigned)

Regardless of the level you choose, the following roles are always assigned.

| Role | Scope | What it allows |
|---|---|---|
| **Reader** | Resource group | View resources and properties |
| **Log Analytics Reader** | Resource group | Query logs and workspaces |
| **Monitoring Reader** | Resource group | Access metrics and monitoring data |
| **Monitoring Contributor** | Subscription | Acknowledge and close Azure Monitor alerts and update monitoring settings |

> [!NOTE]
> Assign the Monitoring Contributor role at the subscription level during agent creation so your agent can manage the Azure Monitor alert lifecycle (acknowledge, close) out of the box.

If you choose **Privileged**, the agent gets additional contributor roles based on the resource types it detects in your managed resource groups (for example, Container App Contributor if the resource group contains Azure Container Apps resources).

## Default state

If you don't assign resource groups when creating an agent, the managed identity has no permissions. You must explicitly grant access for the agent to do anything.

## Grant access to resources

Assign resource groups to your agent, and then grant RBAC roles to the managed identity.

```azurecli
# Grant Reader access to a resource group (view resources, query logs)
az role assignment create \
  --assignee <AGENT_MANAGED_IDENTITY_ID> \
  --role Reader \
  --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>

# Grant Reader access to entire subscription (for broader visibility)
az role assignment create \
  --assignee <AGENT_MANAGED_IDENTITY_ID> \
  --role Reader \
  --scope /subscriptions/<SUBSCRIPTION_ID>

# Grant Contributor access to a resource group (modify resources)
az role assignment create \
  --assignee <AGENT_MANAGED_IDENTITY_ID> \
  --role Contributor \
  --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>
```

> [!TIP]
> For read-only access across multiple resource groups, assign **Reader** at the subscription level instead of resource group by resource group. For write access, assign specific roles at the resource group level. To find your agent's managed identity ID, go to the agent portal (**Settings** > **Azure settings** > **Go to Identity**). You can also find it directly in the Azure portal by navigating to the Container App resource, selecting **Identity**, and copying the **Object (principal) ID**.

## Modify permissions

You can adjust the UAMI's permissions anytime by updating IAM settings on the managed resource groups.

- **Grant more access:** Add role assignments in the resource group's IAM settings.
- **Add a resource group:** Adding a resource group to the agent's scope automatically assigns the UAMI's roles to it.
- **Remove a resource group:** Removing a resource group revokes all access to it.

> [!NOTE]
> You can't remove individual permissions, only entire resource groups.

## Permission flow

When your agent needs to perform an action, it follows a specific permission flow.

:::image type="content" source="media/permissions/permission-flow.svg" alt-text="Permission flow diagram: the agent checks whether its managed identity has the required RBAC roles and uses the managed identity if yes, or requests user permissions through OBO if no.":::

This flow applies to **everything** the agent does including interactive chat, incident threads, scheduled runs, and autonomous operations.

## On-behalf-of (OBO)

When the managed identity lacks permissions for an action, the agent can temporarily use **your** permissions through the [on-behalf-of flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow). This situation is especially common if you chose the **Reader** permission level. The agent has read access but needs your credentials to take write actions.

> [!WARNING]
> Only users with the **SRE Agent Administrator** role can authorize OBO requests. Standard users can't provide OBO authorization. Personal Microsoft accounts can't authorize OBO regardless of role. Only work or school (Microsoft Entra ID) accounts support on-behalf-of token exchange. For more information, see [User roles and permissions](user-roles.md).

### Example

You ask the agent to scale a container app, but the managed identity doesn't have write permissions.

:::image type="content" source="media/permissions/portal-on-behalf-of-authorization.png" alt-text="Screenshot of the on-behalf-of authorization prompt in the agent portal.":::

The agent prompts you to authorize by using your credentials to complete the action. Your permissions are **not retained**, instead the agent returns to using its managed identity after the operation completes.

### When you use OBO

| Scenario | What happens |
|---|---|
| **Reader-level agent needs to act** | The agent has Reader permissions but the user asks it to restart a service. The agent requests Administrator authorization. |
| **Autonomous incident response** | The agent is triggered to remediate but the managed identity only has Reader. The agent requests Administrator authorization. |
| **One-time privileged operation** | Interactive sessions where an Administrator has permissions the agent doesn't. |
| **Personal account user** | OBO authorization isn't available. An Administrator with a work or school account must authorize instead. |

## Related content

| Resource | Why it matters |
|---|---|
| [User roles and permissions](user-roles.md) | What users can do with the agent |
| [Run modes](run-modes.md) | How the agent handles approvals |
| [Audit agent actions](audit-agent-actions.md) | Audit what the agent did with its permissions |
