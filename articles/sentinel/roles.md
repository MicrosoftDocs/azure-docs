---
title: Permissions in Azure Sentinel | Microsoft Docs
description: This article explains how Azure Sentinel uses role-based access control to assign permissions to users and identifies the allowed actions for each role.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: angrobe

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/09/2019
ms.author: yelevin

---

# Permissions in Azure Sentinel

Azure Sentinel uses [Role-Based Access Control(RBAC)](../role-based-access-control/role-assignments-portal.md),
to provide [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Using RBAC, you can use and create roles within your security operations team to grant appropriate access to Azure Sentinel. Based on the roles, you have fine-grained control over what users with access to Azure Sentinel can see. You can assign RBAC roles in the Azure Sentinel workspace directly, or to a subscription or resource group that the workspace belongs to.

There are three specific built-in Azure Sentinel roles.  
**All Azure Sentinel built-in roles grant read access to the data in your Azure Sentinel workspace.**
- [Azure Sentinel Reader](../role-based-access-control/built-in-roles.md#azure-sentinel-reader)
- [Azure Sentinel Responder](../role-based-access-control/built-in-roles.md#azure-sentinel-responder)
- [Azure Sentinel Contributor](../role-based-access-control/built-in-roles.md#azure-sentinel-contributor)

In addition to Azure Sentinel dedicated RBAC roles, there are Azure and Log Analytics RBAC roles that can grant a wider set of permissions that include access to your Azure Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), and [Reader](../role-based-access-control/built-in-roles.md#reader). Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Azure Sentinel resources.

-   **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader). Log Analytics roles grant access across all your Log Analytics workspaces. 

> [!NOTE]
> Log Analytics roles also grant read access across all Azure resources but will only assign write permissions to Log Analytics resources.


For example, a user who is assigned with **Azure Sentinel Reader** and **Azure Contributor** (not **Azure Sentinel Contributor**) roles, will be able to edit data in Azure Sentinel, although they only have **Sentinel Reader** permissions. Therefore, if you want to grant permissions to a user only in Azure Sentinel, you should carefully remove this user’s prior permissions making sure you do not break any needed permission role for another resource.

> [!NOTE]
>- Azure Sentinel uses playbooks for automated threat response. Playbooks leverage Azure Logic Apps and are a separate Azure resource. You might want to assign specific members of your security operations team with the option to use Logic Apps for security orchestration, automation, and response (SOAR) operations. You can use the [Logic App contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor) role or the [Logic App operator](../role-based-access-control/built-in-roles.md#logic-app-operator) role to assign explicit permission for using playbooks.
>- To add data connectors, the necessary roles for each connector are per connector type and are listed in the relevant connector page. In addition, in order to connect any data source, you must have write permission on the Azure Sentinel workspace.



## Roles and allowed actions

The following table displays roles and allowed actions in Azure Sentinel. An X indicates that the action is allowed for that role.

| Role | Create and run playbooks| Create and edit dashboards, analytic rules, and other Azure Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, dashboards and other Azure Sentinel resources |
|--- |---|---|---|---|
| Azure Sentinel Reader | -- | -- | -- | X |
| Azure Sentinel Responder|--|--| X | X |
| Azure Sentinel Contributor | -- | X | X | X |
| Azure Sentinel Contributor + Logic App Contributor | X | X | X | X |


> [!NOTE]
> - We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Azure Sentinel contributor role only to users who need to create rules or dashboards.
> - We recommend that you set permissions for Azure Sentinel in the resource group scope, so the user can have access to all Azure Sentinel workspaces in the same resource group.
>
## Building custom RBAC roles

In addition to, or instead of, using built-in RBAC roles, you can create custom RBAC roles for Azure Sentinel. Custom RBAC roles for Azure Sentinel are created the same way you create other [custom Azure RBAC](../role-based-access-control/custom-roles-rest.md#create-a-custom-role) roles, based on [specific permissions to Azure Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and to [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

## Advanced RBAC on the data you store in Azure Sentinel
  
You can use the Log Analytics advanced role-based access control across the data in your Azure Sentinel workspace. This includes both role-based access control per data type and resource-centric role-based access control. For more information on Log Analytics roles, see [Manage log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md#manage-access-using-workspace-permissions).

## Next steps
In this document, you learned how to work with roles for Azure Sentinel users and what each role enables users to do.

* [Azure Sentinel Blog](https://aka.ms/azuresentinelblog). Find blog posts about Azure security and compliance.
