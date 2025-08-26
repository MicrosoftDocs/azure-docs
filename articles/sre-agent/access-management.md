---
title: Access management in Azure SRE Agent Preview
description: Learn how Azure SRE Agent uses security contexts to handle agent creation and execution.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 08/26/2025
ms.service: azure-sre-agent
---

# Access management in Azure SRE Agent Preview

This article explains how Azure SRE Agent access management operates. The access management includes the user account that creates the agent, user accounts that interact with the agent, and the agent's own managed identity. Each context has specific permission requirements and serves distinct purposes in maintaining a secure environment.

You can ensure that only intended users have access to the agent through Microsoft Entra policies. Microsoft Entra governs identity assignments for the resource groups associated with the agent's managed identity.

## Prerequisites

* **Azure account**: You need an Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* **Security context**: Before you create an agent, make sure that your user account has the `Microsoft.Authorization/roleAssignments/write` permissions as either [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles) or [User Access Administrator](/azure/role-based-access-control/built-in-roles).

* **Namespace**: By using Azure Cloud Shell in the Azure portal, run the following command to set up a namespace:

    ```azurecli  
    az provider register --namespace "Microsoft.App"
    ```

* **Access to the Sweden Central region**: During the preview, the only allowed region for SRE Agent is Sweden Central. Make sure that your user account has *owner* or *admin* permissions, along with permissions to create resources in the Sweden Central region.

## User security context

The security requirements for users depend on the action.

| Action | User account requirements |
|---|---|
| Create an agent | The user account needs to be in the *Owner* or *User Access Administrator* role with owner or admin permissions in the subscription. |
| Access or run an agent | The user account must have *contributor* permissions to the resource group that the agent is running in, or for the agent instance.<br><br>This requirement doesn't mean that the user account needs contributor access to the entire subscription or all resource groups.|

## Agent security context

Azure SRE Agent has its own managed identity that gives the agent the required credentials to act on your behalf as it manages assigned resource groups. You have full control over the roles and permissions applied to the managed identity.

When you create an agent from the portal, you can apply one of the following permission levels. Choose the level that's better suited for your situation.

| Permission level | Description |
|---|---|
| Reader | Initially configured with read-only permissions on the resource groups that the agent manages. When a necessary action requires elevated permissions, the agent prompts the user for a temporary elevation to complete the action. |
| Privileged | Initially configured to take approved actions on resources and resource types detected in the agent's assigned resource groups. |

At any time, you can change which permissions are available to the agent's managed identity by modifying the identity and access management (IAM) settings of a resource group that the agent manages.

As resource groups are added or removed from the agent's scope, the managed identity's permissions are updated accordingly. Removing a resource group revokes the agent's access to the group entirely.

> [!NOTE]
> You can't directly remove specific permissions from the agent. To restrict the agent's access, you must remove the entire resource group from the agent's scope.

### Roles

The agent's managed identity is often preconfigured with the following role assignments for a managed resource group:

* Log Analytics Reader
* Azure Reader
* Monitoring Reader

These assignments are in addition to any required roles related to specific Azure services in resource groups that the agent manages.

## Agent behavior

The agent behaves differently depending on the assigned permissions, the execution mode, and the type of action that it attempts to make.

### Read-only actions

The following table details how the agent behaves when it attempts to conduct a read-only operation that requires elevated permissions.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Uses its permissions to perform the action |
| No | Review | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Automatic | Uses its permissions to perform the action |
| No | Automatic | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

### Write actions

The following table details how the agent behaves when it attempts to conduct a write operation.

| Agent has permission? | Execution mode | Agent behavior |
|---|---|---|
| Yes | Review | Prompts for approval to take action, and then uses its permissions to perform the action upon approval |
| No | Review | Prompts for approval to take action, and then prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |
| Yes | Automatic | Uses its permissions to perform the action |
| No | Automatic | Prompts for temporary access to perform the action [on behalf of the user](/entra/identity-platform/v2-oauth2-on-behalf-of-flow) |

## Related content

* [Troubleshoot Azure SRE Agent](./troubleshoot.md)
