---
title: Permissions in Azure Sentinel | Microsoft Docs
description: This article explains how Azure Sentinel uses Azure role-based access control to assign permissions to users, and identifies the allowed actions for each role.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/14/2021
ms.author: bagol

---

# Roles and permissions in Azure Sentinel

Azure Sentinel uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md)
to provide [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure. Each role provides you with detailed control over what users can see and do in Azure Sentinel.

Use Azure RBAC to create and assign roles within your security operations team to grant access to Azure Sentinel as needed. 

Azure roles can be assigned using the following methods:

- Directly in the Azure Sentinel workspace
- In a subscription or resource group that the Azure Sentinel workspace belongs to. Azure Sentinel inherits roles from the parent subscription or resource group.


## Roles for working in Azure Sentinel

While working in Azure Sentinel, you may encounter and use the following types of roles:

- [Azure Sentinel-specific roles](#azure-sentinel-specific-roles). Azure roles created specifically for Azure Sentinel.
- [Additional roles and permissions](#additional-roles-and-permissions). Azure roles created for other Azure services that are also used in Azure Sentinel.
- [Other roles you might see assigned](#other-roles-you-might-see-assigned). Roles that grant a wider set of permissions and includes access to your Azure Sentinel workspace and resources.
- [Custom roles for Azure Sentinel](#custom-roles-for-azure-sentinel). Used if the built-in roles do not meet your requirements.
- [Resource-based roles for Azure Sentinel](#resource-based-roles-for-azure-sentinel). Use to provide access to specific resources only, without the entire Azure Sentinel experience.

### Azure Sentinel-specific roles

Azure Sentinel's built-in and dedicated roles all grant read access to the data in your Azure Sentinel workspace.

Azure Sentinel roles include:

- [**Azure Sentinel Reader**](../role-based-access-control/built-in-roles.md#azure-sentinel-reader) can view data, incidents, workbooks, and other Azure Sentinel resources.

- [**Azure Sentinel Responder**](../role-based-access-control/built-in-roles.md#azure-sentinel-responder) can, in addition to the above, manage incidents (assign, dismiss, etc.)

- [**Azure Sentinel Contributor**](../role-based-access-control/built-in-roles.md#azure-sentinel-contributor) can, in addition to the above, create and edit workbooks, analytics rules, and other Azure Sentinel resources.

For best results, we recommend that you assign Azure Sentinel roles to a resource group that contains the Azure Sentinel workspace, as well as any other resources that are deployed to support Azure Sentinel. This way, assigned roles apply both to Azure Sentinel, and any other supporting resources.

You can also assign roles directly in the Azure Sentinel workspace. If you choose this option, you must also assign the same roles on the SecurityInsights **solution resource** in your Azure Sentinel workspace. You may need to assign your roles on other resources as well. Assigning roles directly in the Azure Sentinel workspace may require constant role assignments on resources.

### More role and permission requirements

Users with specific job requirements may need other roles or specific permissions in order to accomplish their task.

For example:

|Task  |Requirements  |
|---------|---------|
|**Working with playbooks to automate threat responses**     |   Azure Sentinel uses [playbooks](tutorial-respond-threats-playbook.md) for automated threat response.  Playbooks are built on **Azure Logic Apps**, and are a separate Azure resource. <br><br>You might want to assign to specific members of your security operations team the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations. <br><br>Use the [Logic App Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor) role or the [Logic App Operator](../role-based-access-control/built-in-roles.md#logic-app-operator) role to assign explicit permission for using playbooks.      |
|**Connecting data sources to Azure Sentinel**     |   To add data connectors, a user must have write permissions on the Azure Sentinel workspace. <br><br>Note any other required permissions for each connector, as listed for each connector. For more information, see [Connect data sources](connect-data-sources.md). |
|**Guest users assigning incidents**     |     Guest users who need to assign incidents must have both the [Azure Sentinel Responder](../role-based-access-control/built-in-roles.md#azure-sentinel-responder) role and the [Directory Reader](../active-directory/roles/permissions-reference.md#directory-readers) role. <br><br>  The Directory Reader role is *not* an Azure role, but is an Azure Active Directory role. Regular, non-guest users have this role assigned by default.  |
|     |         |

For more information, see [Roles and allowed actions](#roles-and-allowed-actions).

### Other roles you might see assigned

In assigning [Azure Sentinel-specific Azure roles](#azure-sentinel-specific-roles), you may come across other Azure and Log Analytics Azure roles that may have been assigned to users for other purposes.

Be aware that these roles grant a wider set of permissions, which includes access to your Azure Sentinel workspace and other resources.

For example, a user who is assigned the **Azure Sentinel Reader** role, but not the **Azure Sentinel Contributor** role, will still be able to edit items in Azure Sentinel if assigned the Azure-level **Contributor** role.

Therefore, if you want to grant permissions to a user only in Azure Sentinel, you should carefully remove this user’s prior permissions, making sure you do not break any needed access to another resource.

The following table lists other roles and permissions you may encounter in Azure Sentinel:

|Role type  |Description  |
|---------|---------|
|**Azure roles**     |  Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Azure Sentinel resources. <br><br>These roles include: <br>- [Owner](../role-based-access-control/built-in-roles.md#owner) <br>- [Contributor](../role-based-access-control/built-in-roles.md#contributor) <br>- [Reader](../role-based-access-control/built-in-roles.md#reader).         |
|**Log Analytics roles**     |  Log Analytics roles grant access to your Log Analytics workspaces, and include: <br>-  [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor) <br>- [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader)     |
|    |         |

> [!NOTE]
> Advanced Log Analytics RBAC can be also used across the data in your Azure Sentinel workspace. 
> 
> Support for advanced Azure RBAC includes both the data type-based Azure RBAC and the resource-centric Azure RBAC. For more information, see [Manage log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md#manage-access-using-workspace-permissions).
> 

### Custom roles for Azure Sentinel

Create Azure custom roles for Azure Sentinel if you have different requirements than are provided out of the box.

Custom roles can be created in addition to or instead of the built-in Azure roles, using the [same process used create other Azure custom roles](../role-based-access-control/custom-roles-rest.md#create-a-custom-role).

When creating custom roles for Azure Sentinel, consider the specific permissions [required to Azure Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and to [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

### Resource-based roles for Azure Sentinel

In addition to allowing access to specific *features* using [Azure Sentinel-specific roles](#azure-sentinel-specific-roles), use resource-based roles (resource-based RBAC) to enable users to access specific Azure Sentinel *resources.*

Typically, users who have access to the Azure Sentinel workspace also have access to all its resources. Resource-based roles are used to enable users who don't otherwise have access to Azure Sentinel with access to specific users.

For example, granting access to specific resources only may be helpful for non-security operations users (non-SOC users) who need to view specific logs in order to do their jobs.

To view logs in Azure Sentinel with resource-based role permissions, use one of the following methods:

- **In Azure Sentinel**, navigate to a resource you can access, and then select **Logs** or **Workbooks** on the left. Query or visualize the data as needed for your task.
- **In Azure Monitor**, select **Logs** or **Workbooks** on the left. Use Azure Monitor when you need to select the scope of the query or workbook, span multiple resource groups, or select specific resources to query.

[Resource-based RBAC for Azure Sentinel](resource-based-rbac.md)

> [!TIP]
> Other options for resource-based permissions include:
>
>- Separating your Azure Sentinel implementation into multiple workspaces.
>- Using [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) to set controls on each table in Azure Sentinel.
>- Using [PowerBi dashboards and reports](/azure/azure-monitor/platform/powerbi).
>

## Roles and allowed actions

The following table lists the allowed activities for each role or role combination in Azure Sentinel:

| Role | Create and run playbooks| Create and edit workbooks, analytic rules, and other Azure Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, workbooks, and other Azure Sentinel resources |
|---|---|---|---|---|
| **Azure Sentinel Reader** | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: |
| **Azure Sentinel Responder** | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: |
| **Azure Sentinel Contributor** | :::image type="icon" source="media/no-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: |
| **Azure Sentinel Contributor** + **Logic App Contributor** | :::image type="icon" source="media/yes-icon.png" border="false"::: |:::image type="icon" source="media/yes-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: | :::image type="icon" source="media/yes-icon.png" border="false"::: |
| | | | | |

For more information, see [Azure Sentinel-specific roles](#azure-sentinel-specific-roles) and [More role and permission requirements](#more-role-and-permission-requirements).



## Next steps

- [Create a custom Azure role](../role-based-access-control/custom-roles-rest.md#create-a-custom-role)

- [Manage log data and workspaces in Azure Monitor](../azure-monitor/platform/manage-access.md#manage-access-using-workspace-permissions)