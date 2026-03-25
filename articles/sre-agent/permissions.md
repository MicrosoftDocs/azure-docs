---
title: Agent Permissions in Azure SRE Agent
description: Learn how your agent accesses Azure resources through managed identity and on-behalf-of flow.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: permissions, security, rbac, managed identity, obo, on behalf of
#customer intent: As an SRE, I want to understand how my agent authenticates and gets permissions so that I can securely grant it access to my Azure resources.
---

# Agent permissions in Azure SRE Agent
<!-- > [!VIDEO <PATH_TO_VIDEO>/Azure_SRE_Agent_Permissions.mp4] -->

Every agent has a [managed identity](/entra/identity/managed-identities-azure-resources/overview). Your agent uses the managed identity to authenticate and get permissions to act on Azure resources.

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
> For read-only access across multiple resource groups, assign **Reader** at the subscription level instead of resource group by resource group. For write access, assign specific roles at the resource group level.

To find your agent's managed identity ID, go to the agent portal (**Settings** > **Azure settings** > **Go to Identity**). You can also find it directly in the Azure portal by navigating to the Container App resource, selecting **Identity**, and copying the **Object (principal) ID**.

## Preconfigured roles

When you assign a resource group to your agent, the agent automatically gets the following roles.

| Role | What it allows |
|---|---|
| **Reader** | View resources and properties |
| **Log Analytics Reader** | Query logs and workspaces |
| **Monitoring Reader** | Access metrics and monitoring data |

These roles provide the minimum permissions needed for diagnostics. For actions like restarting services or scaling resources, grant **Contributor** or specific action roles.

## Modify permissions

You can modify your agent's permissions as follows:

- **Grant more access:** Add role assignments in the resource group's IAM settings.
- **Revoke access:** Remove the resource group from the agent's scope.

> [!NOTE]
> You can't remove individual permissions. You can only remove entire resource groups. Removing a resource group revokes all access to that resource group.

## Permission flow

When your agent needs to perform any action, it follows a specific permission flow.

:::image type="content" source="media/permissions/permission-flow.svg" alt-text="Permission flow diagram: the agent checks whether its managed identity has the required RBAC roles and uses the managed identity if yes, or requests user permissions through OBO if no.":::

This flow applies to everything the agent does, including interactive chat, incident threads, scheduled runs, and autonomous operations.

## On-behalf-of (OBO)

When the managed identity doesn't have permission for an action, the agent can temporarily use **your** permissions through the [on-behalf-of flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow).

> [!WARNING]
> Only users with the **SRE Agent Administrator** role can authorize OBO requests. Standard Users can't provide OBO authorization. For more information, see [User roles and permissions](user-roles.md).

### Example

You ask the agent to scale a container app, but the managed identity doesn't have write permissions.

:::image type="content" source="media/permissions/portal-on-behalf-of-authorization.png" alt-text="Screenshot of the on-behalf-of authorization prompt in the agent portal.":::

The agent prompts you to authorize by using your credentials to complete the action. Your permissions are **not retained**. The agent returns to using its managed identity after the operation completes.

### When to use OBO

The following scenarios trigger OBO authorization.

| Scenario | What happens |
|---|---|
| **Autonomous incident response** | Agent is triggered to remediate an incident but managed identity only has Reader. Requests Administrator authorization. |
| **User-initiated write action** | User asks agent to restart a service in chat but managed identity only has Reader. Requests Administrator authorization. |
| **One-time privileged operation** | Interactive sessions where an Administrator has permissions the agent doesn't. |

## Next step

> [!div class="nextstepaction"]
> [Create your agent](./create-agent.md)

## Related content

- [User roles and permissions](user-roles.md): Learn what users can do with the agent.
- [Run modes](run-modes.md): Understand how the agent handles approvals.
