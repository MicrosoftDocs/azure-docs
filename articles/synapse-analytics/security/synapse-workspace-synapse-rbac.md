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

Synapse RBAC extends the capabilities of [Azure RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/overview) to provide additional access control over the Azure resources created or provided in Synapse (like Apache Spark Pools and Integration Runtimes, SQL pool or SQL serverless endpoints) and code artifacts like SQL scripts, Apache Spark notebooks and job definitions, and pipeline definitions.  Whereas Azure RBAC is used to manage who can create, update, or delete Synapse resources, Synapse RBAC allows you to manage who can read, update, and delete code artifacts, as well as who can execute this code, who can monitor or cancel job execution and who can review execution logs.  Note that initially, while Synapse RBAC is used to manage access to SQL scripts created in Synapse, Synapse RBAC is _not_ currently used to control execution of SQL scripts in SQL Pools, which continues to be managed using SQL security.

# What can I do with Synapse RBAC?

Here are some examples of what you can do with Synapse RBAC:
  - Allow a user to create and update Apache Spark notebooks and jobs in a workspace.
  - Grant a user rights to use specific credentials so they can configure a pipeline to run dataflows that access linked services secured with those credentials. 
  - Allow a user to execute an Apache Spark notebook or job against a specific Spark pool.
  - Allow an administrator to manage, monitor, and cancel job execution on specific Spark Pools and Integration Runtimes. 

# How Synapse RBAC works
Like Azure RBAC, Synapse RBAC works by creating role assignments. A role assignment consists of three elements: a security principal, a role definition and a scope.  

## Security Principals

A _security principal_ is an object that represents a user, group, service principal, or managed identity that is requesting access to Synapse code artifacts or to use Synapse resources.

## Roles
 
A _role definition_ is a collection of permissions.  It's typically just called a _role_.  A role lists a set of actions that can be performed on specific resource types or artifact types.  For example, in order to update a SQL script, the _Microsoft.Synapse/workspaces/sqlScripts/write_ action (permission) is required.  Some actions are generic and apply to different kinds of resources or artifacts, others are specific and apply only to specific resource types or artifact types, such as the .../sqlScripts/write action.

Synapse RBAC provides several built-in roles that define useful collections of actions that can be granted in a single role assignment.  The built-in roles correspond to the needs of typical developer, administrator and security roles/personas in analytics projects. Importantly, by separating permissions into different built-in Synapse roles, it allows different privileges to be granted to different people.  Thus developers can be permitted to create update and test SQL scripts, Apache Spark jobs and notebooks and pipelines, but not be allowed to execute these on production compute resources or to access production data sources, pipelines and jobs can run using the workspace MSI principal, which can be granted access to necessary data sources, while operators and administrators can be allowed to monitor and manage execution and review logs. [Learn more](fwlink-to-SRBAC-roles).  

Future releases of Synapse Analytics will also allow custom roles to be defined.

## Scopes

A _scope_ defines the resources or artifacts that the access applies to.  Synapse supports a hierarchical scopes, with permissions granted at a higher-level scope being inherited by objects at a lowe level.  In Synapse RBAC, the top-level scope is a workspace.  Assigning a role with workspace scope grants permissions to all objects of the applicable type(s) within the workspace.  

Current supported scopes within a workspace are: Apache Spark pool, Integration Runtime, Linked Service, Credential.  Dedicated and serverless SQL pools will be supported as scopes in a later release. 

Initially, access to code artifacts is granted with workspace scope.  Granting access to collections of artifacts within a workspace will be supported in a later release.

## Assigning roles and enforcing assigned permissions 

Like Azure RBAC, Synapse RBAC is an additive model. Multiple roles may be assigned to a single principal.  When assessing whether a specific principal, such as a user, has permission to perform some action on a specific resource or code artifact, all the applicable roles assignments are considered, whether assigned to the principal or to groups that directly or indirectly include that principal, and whether scoped to the specific resource or artifact or at a higher level.  

In Synapse Studio, if you don't have the required access to perform some function on a resource or code artifact specific options will be grayed out, or in some cases, an error will be returned.  Typically a tooltip or a notification of some kind will indicate what action (permission) is required to perform the operation.  You will need to contact an administrator to assign you a role that grants the required permission. You can see the roles required to grant specific actions [here](fwlink).

## Who can assign Synapse RBAC roles?

When a new workspace is created, the creator is automatically given the Synapse Administrator role at workspace scope.  The workspace MSI service principal is also automatically granted the Synapse Administrator role at workspace scope.  

Only a Synapse Administrator can assign Synapse RBAC roles.  A Synapse Administrator at the workspace level can grant access at any scope.  A Synapse Administrator at a lower level scope can only grant access at that scope.   

# Where do I manage Synapse RBAC?

Synapse RBAC is managed from the toolbox within Synapse Studio. 

## Next Steps

Understand the built-in [Synapse RBAC roles](../synapse-workspace-synapse-rbac-roles.md).

Learn [how to review Synapse RBAC role assignments](../how-to-review-Synapse-Ra-synapse-rbac-role.md) for a workspace.

Learn [how to assign Synapse RBAC roles](../how-to-assign-a-synapse-rbac-role.md)


 
  
 
   