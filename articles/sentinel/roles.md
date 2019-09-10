---
title: Permissions in Azure Sentinel | Microsoft Docs
description: This article explains how Azure Sentinel uses role-based access control to assign permissions to users and identifies the allowed actions for each role.
services: sentinel
cloud: na
documentationcenter: na
author: rkarlin
manager: angrobe

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: rkarlin

---

# Permissions in Azure Sentinel

Azure Sentinel uses [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Azure Sentinel assesses the configuration of your resources to identify security issues and vulnerabilities. In Azure Sentinel, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

In addition to these roles, after you've enabled Azure Sentinel on your workspace, you will have three additional roles that can be assigned to admins on your workspace:
    - **Azure Sentinel reader**:  A user that belongs to this role has viewing rights to Azure Sentinel. The user can view incidents, and policies but cannot make changes.
    - **Azure Sentinel incident manager**: A user that belongs to this role can read and perform actions on incidents.
    - **Azure Sentinel contributor**: A user that belongs to this role can read and perform actions on incidents and create and delete analytic rules.


Alternatively, you can use the Log Analytics advanced role-based access control across the data in your Azure Sentinel workspace. This includes both Role-based access control per data type and resource-centric role-based access control. For more information on Log Analytics roles, see [Manage log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md)
> [!NOTE]
> - You can create a custom role for Azure Sentinel the same way you create other custom Azure roles based on the Azure Sentinel swagger resources. 
> - For some resources in Azure Sentinel, the permissions don't come from Azure Sentinel roles so you have to use their role guidelines. These include Playbooks, Logic Apps and Azure Dashboards.
> - To add connectors, the roles for the permissions for each connector are per connector type and are listed in the relevant connector documentation.
> The security roles, Security Reader and Security Administrator, have access only in Azure Sentinel. The security roles do not have access to other service areas of Azure such as Storage, Web & Mobile, or Internet of Things.
>


## Roles and allowed actions

The following table displays roles and allowed actions in Sentinel. An X indicates that the action is allowed for that role.

| Role | Edit policy | Create dashboard |  Dismiss alerts and incidents | View alerts and incidents |
|:--- |:---:|:---:|:---:|:---:|
| Azure Sentinel reader | -- | -- | -- | X |
| Azure Sentinel incident manager | -- | X | X | X |
| Azure Sentinel contributor | X | X | X | X |

> [!NOTE]
> We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as remediating incidents or editing policies.
>
>

## Next steps
In this document, you learned how to assign roles to Azure Sentinel users.

* [Azure Security Blog](https://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
