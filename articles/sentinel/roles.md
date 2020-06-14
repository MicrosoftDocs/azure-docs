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
ms.date: 06/14/2020
ms.author: yelevin

---

# Permissions in Azure Sentinel

Azure Sentinel uses [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md)
to provide [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

You can use RBAC to create and assign roles within your security operations team to grant appropriate access to Azure Sentinel. The different roles give you fine-grained control over what users of Azure Sentinel can see. You can assign RBAC roles in the Azure Sentinel workspace directly, or in a subscription or resource group that the workspace belongs to, which Azure Sentinel will inherit.

## Azure Sentinel roles

There are three dedicated built-in Azure Sentinel roles.  
**All Azure Sentinel built-in roles grant read access to the data in your Azure Sentinel workspace.**
- [Azure Sentinel Reader](../role-based-access-control/built-in-roles.md#azure-sentinel-reader)
- [Azure Sentinel Responder](../role-based-access-control/built-in-roles.md#azure-sentinel-responder)
- [Azure Sentinel Contributor](../role-based-access-control/built-in-roles.md#azure-sentinel-contributor)

In addition to the Azure Sentinel-specific RBAC roles, there are Azure and Log Analytics RBAC roles that can grant a wider set of permissions that include access to your Azure Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), and [Reader](../role-based-access-control/built-in-roles.md#reader). Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Azure Sentinel resources.

- **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor) and [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader). Log Analytics roles grant access across all your Log Analytics workspaces. 

    > [!NOTE]
    > Log Analytics roles also grant read access across all Azure resources, but will assign write permissions only to Log Analytics resources.

For example, a user who is assigned the **Azure Sentinel Reader** role, but not the **Azure Sentinel Contributor** role, will still be able to edit data in Azure Sentinel if assigned the Azure-level **Contributor** role. Therefore, if you want to grant permissions to a user only in Azure Sentinel, you should carefully remove this user’s prior permissions, making sure you do not break any needed access to another resource.

### Additional roles and permissions

- Azure Sentinel uses **playbooks** for automated threat response. Playbooks are built on **Azure Logic Apps**, and are a separate Azure resource. You might want to assign specific members of your security operations team with the option to use Logic Apps for security orchestration, automation, and response (SOAR) operations. You can use the [Logic App Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor) role or the [Logic App Operator](../role-based-access-control/built-in-roles.md#logic-app-operator) role to assign explicit permission for using playbooks.

- To add **data connectors**, note the required additional permissions for each connector, as listed on the relevant connector page. In addition, in order to connect any data source, you must have write permission on the Azure Sentinel workspace.

## Roles and allowed actions

The following table displays roles and allowed actions in Azure Sentinel. An X indicates that the action is allowed for that role.

| Role | Create and run playbooks| Create and edit workbooks, analytic rules, and other Azure Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, workbooks and other Azure Sentinel resources |
|---|---|---|---|---|
| Azure Sentinel Reader | -- | -- | -- | X |
| Azure Sentinel Responder | -- | -- | X | X |
| Azure Sentinel Contributor | -- | X | X | X |
| Azure Sentinel Contributor + Logic App Contributor | X | X | X | X |


> [!NOTE]
>
> - We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Azure Sentinel Contributor role only to users who need to create rules or workbooks.
>
> - We recommend that you assign Azure Sentinel roles at the **resource group** level, so the user can have access to all Azure Sentinel workspaces in the same resource group.
>
> - If you don't want to assign a user Azure Sentinel roles on the entire resource group, you can grant more limited permissions by assigning those roles:
>    - at the Log Analytics workspace level, *and*
>    - on the **SecurityInsights** solution resource on the corresponding workspace(s).

## Custom roles and advanced RBAC

- In addition to, or instead of, using built-in RBAC roles, you can create custom RBAC roles for Azure Sentinel. Custom RBAC roles for Azure Sentinel are created the same way you create other [custom Azure RBAC](../role-based-access-control/custom-roles-rest.md#create-a-custom-role) roles, based on [specific permissions to Azure Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and to [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

- You can use the Log Analytics advanced role-based access control across the data in your Azure Sentinel workspace. This includes both data type-based RBAC and resource-centric RBAC. For more information on Log Analytics roles, see [Manage log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md#manage-access-using-workspace-permissions).

## Next steps
In this document, you learned how to work with roles for Azure Sentinel users and what each role enables users to do.

* [Azure Sentinel Blog](https://aka.ms/azuresentinelblog). Find blog posts about Azure security and compliance.
