---
title: Security contexts in Azure SRE Agent (preview)
description: Learn how SRE Agent uses different security contexts to handle agent creation and execution.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 07/16/2025
ms.service: azure
---

# Security contexts in Azure SRE Agent (preview)

This article explains the different security contexts involved in Azure SRE Agent operations. The security contexts include the user account that creates the agent, user accounts that interact with the agent, and the agent's own managed identity. Each context has specific permission requirements and serves different purposes in maintaining a secure environment.

Microsoft Entra enforces security policies that govern identity assignments as you associate resource groups with the agent's managed identity.

## Prerequisites

You need to grant your agent the correct permissions and access to the right namespace.

* **Security context**: Before you create a new agent, make sure your user account has the `Microsoft.Authorization/roleAssignments/write` permissions using either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Sweden Central region access**: During preview, the only allowed region for SRE Agent is Sweden Central. Make sure your user account has *owner* or *admin* permissions and permissions to create resources in the Sweden Central region.

## User security context

The security requirements for users are different depending on if you're creating or using the agent.

| Action | User account requirements |
|---|---|
| Create agent | The user account needs to be in the *Owner* or *User Access Administrator* role with *Owner or *Admin* permissions in the subscription. |
| Access/run the agent | The user account must have *Contributor* permissions to the resource group the agent is running in, or for the agent instance.<br><br>**Note**: This requirement doesn't mean the user account needs *Contributor* access to the entire subscription or all resource groups.|

## Agent security context

When you create an agent, a managed identity is created and automatically configured with the appropriate roles and permissions required for the agent to run in the assigned resource groups.

By default the agent is granted *Reader* permissions on the resource groups it manages. If higher privileges are needed for a specific operation, temporary *Contributor* permissions are granted with user approval.

When you create the agent, assigning the resource groups you select to manage are associated to the agent's managed identity.

As resource groups are added or removed from the agent's scope, the managed identity's permissions are updated accordingly. Removing a resource group revokes the agent's access to the group entirely.

If the agent lacks permissions for an action, it prompts the user for authorization to complete the action.

### Agent permissions level

When you create an agent, you can allow the agent to run as a *Reader* or with a *Privileged* permission level. The following table describes the difference between the two levels.

| Permission level | Description |
|---|---|
| Reader | The agent has read-only permissions on the resource groups it manages. When an action is required that requires elevated permissions, the agent prompts the user for temporary to complete the action. |
| Privileged | The agent has permissions to take approved actions on resources and resource types detected in its assigned resource groups. |

> [!NOTE]
> You can't directly remove specific permissions from the agent. To restrict the agent's access, you must remove the entire resource group from the agent's scope.

## Agent behavior

The agent behaves differently depending on the permissions assigned, the execution mode, and the type of action it attempts to make. The following tables list how the agent responds in different scenarios.

### Read-only actions

The following table details how the agent behaves when attempting to conduct a read-only operation that requires elevated permissions.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Reads required data and doesn't prompt for approval |
| No | Review | Prompts for approval to take action |
| Yes | Auto | Executes action without requiring approval |
| No | Auto | Prompts for approval, and executes action based on approval status |

### Write actions

The following table details how the agent behaves when attempting to conduct a write operation.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Prompts for approval to take action |
| No | Review | Prompts for approval to take action, if granted the agent temporarily inherits the required permissions from the user |
| Yes | Auto | Executes action without requiring approval |
| No | Auto | Prompts for approval, and executes action based on approval status |

## Related content

* [Troubleshoot common errors](./troubleshoot.md)
