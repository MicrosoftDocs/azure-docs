---
title: Synapse Role Based Access Control
description: An article that explains role based access control in Azure Synapse Analytics
author: billgib
ms.service: synapse-analytics 
ms.topic: access control
ms.subservice: security
ms.date: 12/1/2020
ms.author: billgib
ms.reviewer: jrasnick
---
# What is Synapse role-based access control (Synapse RBAC)?

Synapse RBAC extends the capabilities of [Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview) to provide additional access control over the Azure resources created or provided in Synapse (like Apache Spark Pools and Integration Runtimes, SQL pool or SQL serverless endpoints) and code artifacts like SQL scripts, Apache Spark notebooks and job definitions, and pipeline definitions.  Whereas Azure RBAC is used to manage who can create, update, or delete Synapse resources, Synapse RBAC allows you to manage who can read, update, and delete code artifacts, as well as who can execute this code, who can monitor or cancel job execution and who can review job output and execution logs.  

>[!Note]
>Note that initially, while Synapse RBAC is used to manage access to SQL scripts created in Synapse, Synapse RBAC is _not_ used to control execution of SQL scripts in SQL Pools, which is managed using SQL security.

## What can I do with Synapse RBAC?

Here are some examples of what you can do with Synapse RBAC:
  - Allow a user to publish changes made to Apache Spark notebooks and jobs to the live service.
  - Grant a user permission to run and cancel notebooks and spark jobs on a specific Apache Spark pool.
  - Grant a user permission to use specific credentials so they can run a pipeline that contains dataflows that access linked services that are secured with those credentials. 
  - Allow an administrator to manage, monitor, and cancel job execution on specific Spark Pools and Integration Runtimes.    

## How Synapse RBAC works
Like Azure RBAC, Synapse RBAC works by creating role assignments. A role assignment consists of three elements: a security principal, a role definition, and a scope.  

### Security Principals

A _security principal_ is an object that represents a user, group, service principal, or managed identity that is requesting access to Synapse resources or code artifacts.

### Roles
 
A _role definition_ or *'role'* is a collection of permissions.  A role lists a set of actions that can be performed on specific resource types or artifact types.  For example, in order to update a SQL script, the _Microsoft.Synapse/workspaces/sqlScripts/write_ action/permission is required.  Some actions are generic and apply to different kinds of resources or artifacts, others are specific and apply only to specific resource types or artifact types, such as the .../sqlScripts/write action.

Synapse RBAC provides several built-in roles that define useful collections of actions that can be granted together. The built-in roles match the needs of typical developer, administrator, or security personas. Providing these roles makes it easy to grant different sets of permissions to different people.  Developers can create, update and test SQL scripts, Apache Spark jobs and notebooks and pipelines, but can be prevented from executing this code on production compute resources or accessing production data.  Likewise, operators and administrators can monitor and manage application execution and review logs, without having access to the code or the outputs from execution. [Learn more](https://go.microsoft.com/fwlink/?linkid=2148306).  

Future releases of Synapse Analytics will also allow custom roles to be defined.

### Scopes

A _scope_ defines the resources or artifacts that the access applies to.  Synapse supports hierarchical scopes.  Permissions granted at a higher-level scope are inherited by objects at a lower level.  In Synapse RBAC, the top-level scope is a workspace.  Assigning a role with workspace scope grants permissions to all applicable objects in the workspace.  

Current supported scopes within a workspace are: Apache Spark pool, Integration runtime, linked service, and credential.  Dedicated and serverless SQL pools will be supported as scopes in a later release. 

Initially, access to code artifacts is granted with workspace scope.  Granting access to collections of artifacts within a workspace will be supported in a later release.

## Assigning roles and enforcing assigned permissions 

Like Azure RBAC, Synapse RBAC is an additive model. Multiple roles may be assigned to a single principal.  When the system assesses whether a specific principal, such as a user, has permission to perform some action on a specific resource or code artifact, all the applicable roles assignments are considered, whether assigned to the principal or to groups that directly or indirectly include that principal, and whether scoped to the specific object or at a higher level.  

In Synapse Studio, if you don't have the required permission to perform some function, specific buttons or options may be grayed out, or in some cases, an error will be returned.  If a button or option is disabled a tooltip or a toast notification will indicate what action (permission) is required.  You will need to contact a Synapse Administrator to assign you a role that grants the required permission. You can see the roles required to grant specific actions [here](https://go.microsoft.com/fwlink/?linkid=2148305).

## Who can assign Synapse RBAC roles?

When a new workspace is created, the creator is automatically given the Synapse Administrator role at workspace scope.  

Only a Synapse Administrator can assign Synapse RBAC roles.  A Synapse Administrator at the workspace level can grant access at any scope.  A Synapse Administrator at a lower-level scope can only grant access at that scope.   

## Where do I manage Synapse RBAC?

Synapse RBAC is managed from within Synapse Studio using the Access control tools in the Manage hub. 

## Next Steps

Understand the built-in [Synapse RBAC roles](./synapse-workspace-synapse-rbac-roles.md).

Learn [how to review Synapse RBAC role assignments](./how-to-review-Synapse-Ra-synapse-rbac-role.md) for a workspace.

Learn [how to assign Synapse RBAC roles](./how-to-assign-a-synapse-rbac-role.md)


 
  
 
   