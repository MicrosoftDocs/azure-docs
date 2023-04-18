---
title: Azure Synapse role-based access control
description: An article that explains role-based access control in Azure Synapse Analytics
author: meenalsri
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: security
ms.date: 3/07/2022
ms.author: mesrivas
ms.reviewer: sngun, wiassaf
---
# What is Synapse role-based access control (RBAC)?

Synapse RBAC extends the capabilities of [Azure RBAC](../../role-based-access-control/overview.md) for Synapse workspaces and their content. 

Azure RBAC is used to manage who can create, update, or delete the Synapse workspace and its SQL pools, Apache Spark pools, and Integration runtimes.

Synapse RBAC is used to manage who can:
- Publish code artifacts and list or access published code artifacts, 
- Execute code on Apaches Spark pools and Integration runtimes,
- Access linked (data) services protected by credentials 
- Monitor or cancel job execution, review job output, and execution logs.  

>[!Note]
>While Synapse RBAC is used to manage access to published SQL scripts, it provides only limited access control to serverless and dedicated SQL pools. Access to SQL pools is primarily controlled using SQL security.

## What can I do with Synapse RBAC?

Here are some examples of what you can do with Synapse RBAC:
  - Allow a user to publish changes made to Apache Spark notebooks and jobs to the live service.
  - Allow a user to run and cancel notebooks and spark jobs on a specific Apache Spark pool.
  - Allow a user to use specific credentials so they can run pipelines secured by the workspace system identity and access data in linked services secured with credentials. 
  - Allow an administrator to manage, monitor, and cancel job execution on specific Spark Pools.    

## How Synapse RBAC works
Like Azure RBAC, Synapse RBAC works by creating role assignments. A role assignment consists of three elements: a security principal, a role definition, and a scope.  

### Security Principals

A _security principal_ is a user, group, service principal, or managed identity.

### Roles
 
A _role_ is a collection of permissions or actions that can be performed on specific resource types or artifact types.

Synapse provides built-in roles that define collections of actions that match the needs of different personas:
- Administrators can get full access to create and configure a workspace 
- Developers can create, update and debug SQL scripts, notebooks, pipelines, and dataflows, but not be able to publish or execute this code on production compute resources/data
- Operators can monitor and manage system status, application execution and review logs, without access to code or the outputs from execution.
- Security staff can manage and configure endpoints without having access to code, compute resources or data.

[Learn more](./synapse-workspace-synapse-rbac-roles.md) about the built-in Synapse roles. 

### Scopes

A _scope_ defines the resources or artifacts that the access applies to. Azure Synapse supports hierarchical scopes.  Permissions granted at a higher-level scope are inherited by objects at a lower level.  In Synapse RBAC, the top-level scope is a workspace.  Assigning a role with workspace scope grants permissions to all applicable objects in the workspace.  

Current supported scopes within a workspace are: 

- Apache Spark pool
- Integration runtime
- linked service
- credential

Access to code artifacts is granted with workspace scope.  Granting access to collections of artifacts within a workspace will be supported in a later release.

## Resolving role assignments to determine permissions

A role assignment grants a principal the permissions defined by the role at the specified scope.

Synapse RBAC is an additive model like Azure RBAC. Multiple roles may be assigned to a single principal and at different scopes. When computing the permissions of a security principal, the system considers all roles assigned to the principal and to groups that directly or indirectly include the principal.  It also considers the scope of each assignment in determining the permissions that apply.  

## Enforcing assigned permissions

In Synapse Studio, specific buttons or options may be grayed out or a permissions error may be returned when attempting an action if you don't have the required permissions. 

If a button or option is disabled, hovering over the button or option shows a tooltip with the required permission.  Contact a Synapse Administrator to assign a role that grants the required permission. You can see the roles that provide specific actions, see [Synapse RBAC Roles](./synapse-workspace-synapse-rbac-roles.md).

## Who can assign Synapse RBAC roles?

Synapse Administrators can assign Synapse RBAC roles.  A Synapse Administrator at the workspace level can grant access at any scope.  A Synapse Administrator at a lower-level scope can only grant access at that scope. 

When a new workspace is created, the creator is automatically given the Synapse Administrator role at workspace scope.

To help you regain access to a workspace in the event that no Synapse Administrators are assigned or available to you, users with permissions to manage Azure RBAC role assignments on the workspace can also manage Synapse RBAC role assignments, allowing the addition of Synapse Administrator or other Synapse role assignments.

## Where do I manage Synapse RBAC?

Synapse RBAC is managed from within Synapse Studio using the access control tools in the **Manage** hub. 

## Next steps

Understand the built-in [Synapse RBAC roles](./synapse-workspace-synapse-rbac-roles.md).

Learn [how to review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md) for a workspace.

Learn [how to assign Synapse RBAC roles](./how-to-manage-synapse-rbac-role-assignments.md)
