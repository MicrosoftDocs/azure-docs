---
title: Security contexts in Azure SRE Agent (preview)
description: Learn how SRE Agent uses different security contexts to handle agent creation and execution.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 07/18/2025
ms.service: azure
---

# Security contexts in Azure SRE Agent (preview)

This article explains the different security contexts involved in Azure SRE Agent operations. The security contexts include the user account that creates the agent, user accounts that interact with the agent, and the agent's own managed identity. Each context has specific permission requirements and serves different purposes in maintaining a secure environment.

You can ensure that only intended users have access to the agent through Microsoft Entra policies. Microsoft Entra governs identity assignments for the resource groups associated with the agent's managed identity.

## Prerequisites

You need to grant your agent the correct permissions and access to the right namespace.

* **Security context**: Before you create a new agent, make sure your user account has the `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Sweden Central region access**: During preview, the only allowed region for SRE Agent is Sweden Central. Make sure your user account has *owner* or *admin* permissions and permissions to create resources in the Sweden Central region.

## User security context

The security requirements for users are different depending on if you're creating or using the agent.

| Action | User account requirements |
|---|---|
| Create agent | The user account needs to be in the *Owner* or *User Access Administrator* role with *Owner* or *Admin* permissions in the subscription. |
| Access/run the agent | The user account must have *Contributor* permissions to the resource group the agent is running in, or for the agent instance.<br><br>**Note**: This requirement doesn't mean the user account needs *Contributor* access to the entire subscription or all resource groups.|

## Agent security context

Azure SRE Agent has its own managed identity that gives the agent the required credentials to act on your behalf as it manages assigned resource groups. You have full control over the roles and permissions applied to the managed identity.

When you create the agent from the portal, you can select from different permissions levels best suited for your situation. When you create an agent, you can apply the *Reader* or *Privileged* permission level.

The following table describes the difference between the two levels.

| Permission level | Description |
|---|---|
| Reader | Initially configured with read-only permissions on the resource groups it manages. When an action is required that requires elevated permissions, the agent prompts the user for temporary to complete the action. |
| Privileged | Initially configured to take approved actions on resources and resource types detected in its assigned resource groups. |

At any time, you can change which permissions are available to the agent's managed identity by modifying the access control (IAM) settings of a resource group manged by the agent.

As resource groups are added or removed from the agent's scope, the managed identity's permissions are updated accordingly. Removing a resource group revokes the agent's access to the group entirely.

> [!NOTE]
> You can't directly remove specific permissions from the agent. To restrict the agent's access, you must remove the entire resource group from the agent's scope.

### Roles

The agent's managed identity is often preconfigured with the following role assignments for a managed resource group:

* Log Analytics Reader
* Azure Reader
* Monitoring Reader

Plus any required roles related to specific Azure services in resource groups managed by the agent. 

## Agent behavior

The agent behaves differently depending on the permissions assigned, the execution mode, and the type of action it attempts to make. The following tables list how the agent responds in different scenarios.

### Read-only actions

The following table details how the agent behaves when attempting to conduct a read-only operation that requires elevated permissions.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Uses its permissions to perform the action. |
| No | Review | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Auto | Uses its permissions to perform the action |
| No | Auto | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

### Write actions

The following table details how the agent behaves when attempting to conduct a write operation.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Prompts for approval to take action, then the agent uses its permissions to perform the action upon approval |
| No | Review | First prompts for approval to take action, then prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Auto | Uses its permissions to perform the action |
| No | Auto | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

## Related content

* [Troubleshoot common errors](./troubleshoot.md)
