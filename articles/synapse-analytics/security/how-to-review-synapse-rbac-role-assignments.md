---
title: How to assign a Synapse RBAC role in Synapse Studio
description: An article that describes how to assign Synapse RBAC roles to AAD security principals
author: billgib
ms.service: synapse-analytics 
ms.topic: access control
ms.subservice: security
ms.date: 12/1/2020
ms.author: billgib
ms.reviewer: jrasnick
---

## How to review Synapse RBAC role assignments

Synapse RBAC roles are used to assign permissions to users, groups and other security principals to enable access and use of Synapse resources.  [Learn more](fwlink)

This article explains how to review the current role assignments for a workspace.

Any user with Synapse Reader role can list Synapse RBAC role assignments for all scopes, including assignments for roles you don't have and objects you don't have access to. Only a Synapse Administrator can grant Synapse RBAC access.  If you want to get access to objects within a specific scope you should contact a Synapse Administrator for that scope or a higher-level scope.    

## Open Synapse Studio  

To review role assignments first [open the Synapse Studio](https://web.azuresynapse.net/) and select your workspace. 

![Log in to workspace](./media/common/login-workspace.png) 
 
 Once you've opened your workspace, click on **Manage** (toolbox) on the left, expand the **Security** section  and select **Access control**. 

 ![Select Access Control in Security section on left](./media/how-to-assign-a-synapse-rbac-role/left-nav-security-access-control.png)

The Access control screen lists all current role assignments for the workspace, grouped by role. 

 For each assignment, the principal name, principal type (individual, group, or service principal), role and the scope at which it was assigned are shown.  All assignments are shown, including those at workspace and lower level scopes.

![Select Access Control in Security section on left](./media/how-to-assign-a-synapse-rbac-role/access-control-assignments.png)

If a principal is assigned the same role at different scopes you will see multiple assignments for the principal, one for each scope.  

If a role is assigned at a group level, you will see the group role assignment but not any assignments inherited by members of the group.  

You can filter the list by principal name or email and selectively filter which object types, roles, and/or scopes are shown. To see your own role assignments, enter your name or your AAD identity (typically your email alias) in the Name filter.  

>[!Important] If you are directly or indirectly a member of any group(s) that are assigned roles you may have permissions that are not shown.

When a new workspace is created, the creator is automatically given the Synapse Administrator role at workspace scope.  The workspace MSI service principal is also automatically granted the Synapse Administrator role at workspace scope.

## Next Steps

Learn [how to manage Synapse RBAC role assignments](../how-to-assign-a-synapse-rbac-role.md).

Learn [which role you need to perform specific tasks](synapse-workspace-understand-what-role-you-need.md)