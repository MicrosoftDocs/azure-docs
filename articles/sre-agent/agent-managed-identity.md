---
title: User access roles and agent and user permissions Azure SRE Agent Preview
description: Learn how agent and user permissions affect how SRE Agent behaves.
author: craigshoemaker
ms.topic: conceptual
ms.date: 09/11/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Managed identity in Azure SRE Agent  Preview

The Azure SRE Agent features a flexible model for managing roles and access management based on Azure role-based access control (RBAC) and the [Principle of Least Privilege](/entra/identity-platform/secure-least-privileged-access). This model ensures users only interact with the agent and managed resources according to Azure RBAC policies.

## Agent permissions

Azure SRE Agent has its own managed identity that gives the agent the required credentials to act on your behalf as it manages assigned resource groups. You have full control over the roles and permissions applied to this managed identity.

When you create an agent from the portal, you can apply one of the following permission levels. Choose the level best suited for your situation.

| Permission level | Description |
|---|---|
| Reader | Initially configured with read-only permissions on the resource groups that the agent manages. When a necessary action requires elevated permissions, the agent prompts the user for a temporary elevation using [OBO flow](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) to complete the action. |
| Privileged | Initially configured to take approved actions on resources and resource types detected in the agent's assigned resource groups. |

The agent's managed identity is preconfigured with the following role assignments for a managed resource group:

- Log Analytics Reader
- Azure Reader
- Monitoring Reader

These assignments are in addition to any required roles related to specific Azure services in resource groups that the agent manages.

At any time, you can change which permissions are available to the agent's managed identity by modifying the identity and access management (IAM) settings of a resource group that the agent manages.

As resource groups are added or removed from the agent's scope, the managed identity's permissions are updated accordingly. Removing a resource group revokes the agent's access to the group entirely.

> [!NOTE]
> You can't directly remove specific permissions from the agent. To restrict the agent's access, you must remove the entire resource group from the agent's scope.

## Agent actions

The agent can only take action when it has user consent and the appropriate RBAC assignments to take an action. Users provide explicit consent when the agent is running in review mode, and implicit consent for agents working autonomously in the context of an incident response plan.

Examples of agent actions include:

- Update incidents in PagerDuty and ServiceNow.

- Create work items in Azure DevOps and GitHub.

- Run diagnostics on Azure resources (query logs, fetch metrics, inspect states).

- Execute mitigations (restart services, scale resources, rollback deployments).

- Access observability data (dashboards, charts, traces).

For more information on how RBAC security is enforced, see [Agent run modes in Azure SRE Agent](agent-run-modes.md).

## User actions

Azure RBAC enforces security at the resource, resource group, or subscription level.

Consider the following questions:

- What happens when a user's permission level doesn't match what they're trying to do in the agent?

- What happens when a user is more restricted inside the agent than they are outside the agent?

The answer to both of these questions is the same. The agent permissions scope takes precedence. This security model prevents "backdoor" elevation of privileges via the agent.

Here's a few example scenarios that can help illustrate how the security model is enforced.

| Scenario | SRE Agent role | Permissions on Azure resources | Description |
|---|---|---|---|
| User has elevated rights on the agent's resource group, but only has reader access to the agent. | *SRE Agent Reader* | *Owner* role on the agent's resource group | The RBAC rules normally would allow this user to create or delete resources in the resource group, however this user's capability is limited inside the agent. Since the user is only set as an *SRE Agent Reader*, the user can only view logs, chats, and configuration files. |
| User is an owner to a resource, but is only a user of the agent. | *SRE Agent Standard User* | *Owner* on an AKS cluster managed by SRE Agent | The user, outside the agent, can directly scale the cluster via CLI or Azure portal since this user has the *Owner* role to the AKS cluster. However, within the agent, their *SRE Agent Reader* role restricts them to only triage, diagnostics, and escalation requests.<br><br>This user can't approve mitigations inside the agent, even with elevated privileges outside the agent. Only *SRE Agent Admin* users can perform these privileged actions. |
| User is an administrator to the agent, but the agent and the user have limited access to resources managed by the agent. | *SRE Agent Admin* | User *doesn't* have *Contributor* or *Owner* access to an App Service instance managed by the agent | A request fails when this user tries to roll back the App Service instance. This operation fails because the agent’s managed identity doesn't have *Contributor* permissions on the App Service instance.<br><br>The *SRE Agent Admin* role gives the user authority in the agent, but Azure RBAC rules enforce boundaries limit what the user can do outside the agent. |

## Related content

- [Agent run modes](./agent-run-modes.md)
- [User access roles](./user-access-roles.md)
