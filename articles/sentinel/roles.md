---
title: Permissions in Microsoft Sentinel | Microsoft Docs
description: This article explains how Microsoft Sentinel uses Azure role-based access control to assign permissions to users, and identifies the allowed actions for each role.
author: yelevin
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Permissions in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Sentinel uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) to provide [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Use Azure RBAC to create and assign roles within your security operations team to grant appropriate access to Microsoft Sentinel. The different roles give you fine-grained control over what users of Microsoft Sentinel can see and do. Azure roles can be assigned in the Microsoft Sentinel workspace directly (see note below), or in a subscription or resource group that the workspace belongs to, which Microsoft Sentinel will inherit.

## Roles for working in Microsoft Sentinel

### Microsoft Sentinel-specific roles

**All Microsoft Sentinel built-in roles grant read access to the data in your Microsoft Sentinel workspace.**

- [Microsoft Sentinel Reader](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader) can view data, incidents, workbooks, and other Microsoft Sentinel resources.

- [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) can, in addition to the above, manage incidents (assign, dismiss, etc.)

- [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) can, in addition to the above, create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.

- [Microsoft Sentinel Automation Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-automation-contributor) allows Microsoft Sentinel to add playbooks to automation rules. It is not meant for user accounts.

> [!NOTE]
>
> - For best results, these roles should be assigned on the **resource group** that contains the Microsoft Sentinel workspace. This way, the roles will apply to all the resources that are deployed to support Microsoft Sentinel, as those resources should also be placed in that same resource group.
>
> - Another option is to assign the roles directly on the Microsoft Sentinel **workspace** itself. If you do this, you must also assign the same roles on the SecurityInsights **solution resource** in that workspace. You may need to assign them on other resources as well, and you will need to be constantly managing role assignments on resources.

### Additional roles and permissions

Users with particular job requirements may need to be assigned additional roles or specific permissions in order to accomplish their tasks.

- **Working with playbooks to automate responses to threats**

    Microsoft Sentinel uses **playbooks** for automated threat response. Playbooks are built on **Azure Logic Apps**, and are a separate Azure resource. You might want to assign to specific members of your security operations team the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations. You can use the [Logic App Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor) role to assign explicit permission for using playbooks.

- **Giving Microsoft Sentinel permissions to run playbooks**

    Microsoft Sentinel uses a special service account to run incident-trigger playbooks manually or to call them from automation rules. The use of this account (as opposed to your user account) increases the security level of the service.

    In order for an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule will be able to run any playbook in that resource group. To grant these permissions to this service account, your account must have **Owner** permissions on the resource groups containing the playbooks.

- **Connecting data sources to Microsoft Sentinel**

    For a user to add **data connectors**, you must assign the user write permissions on the Microsoft Sentinel workspace. Also, note the required additional permissions for each connector, as listed on the relevant connector page.

- **Guest users assigning incidents**

    If a guest user needs to be able to assign incidents, then in addition to the Microsoft Sentinel Responder role, the user will also need to be assigned the role of [Directory Reader](../active-directory/roles/permissions-reference.md#directory-readers). Note that this role is *not* an Azure role but an **Azure Active Directory** role, and that regular (non-guest) users have this role assigned by default.

- **Creating and deleting workbooks**

    To create and delete a Microsoft Sentinel workbook, the user requires either the Microsoft Sentinel Contributor role or a lesser Microsoft Sentinel role plus the Azure Monitor role of [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor). This role is not necessary for *using* workbooks, but only for creating and deleting.

### Other roles you might see assigned

In assigning Microsoft Sentinel-specific Azure roles, you may come across other Azure and Log Analytics Azure roles that may have been assigned to users for other purposes. You should be aware that these roles grant a wider set of permissions that includes access to your Microsoft Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), and [Reader](../role-based-access-control/built-in-roles.md#reader). Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Microsoft Sentinel resources.

- **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor) and [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader). Log Analytics roles grant access to your Log Analytics workspaces.

For example, a user who is assigned the **Microsoft Sentinel Reader** role, but not the **Microsoft Sentinel Contributor** role, will still be able to edit items in Microsoft Sentinel if assigned the Azure-level **Contributor** role. Therefore, if you want to grant permissions to a user only in Microsoft Sentinel, you should carefully remove this user’s prior permissions, making sure you do not break any needed access to another resource.

## Microsoft Sentinel roles and allowed actions

The following table summarizes the Microsoft Sentinel roles and their allowed actions in Microsoft Sentinel.

| Role | Create and run playbooks| Create and edit analytics rules, workbooks, and other Microsoft Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, workbooks, and other Microsoft Sentinel resources |
|---|---|---|---|---|
| Microsoft Sentinel Reader | -- | --[*](#workbooks) | -- | &#10003; |
| Microsoft Sentinel Responder | -- | --[*](#workbooks) | &#10003; | &#10003; |
| Microsoft Sentinel Contributor | -- | &#10003; | &#10003; | &#10003; |
| Microsoft Sentinel Contributor + Logic App Contributor | &#10003; | &#10003; | &#10003; | &#10003; |


<a name=workbooks></a>* Users with these roles can create and delete workbooks with the additional [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) role. For more information, see [Additional roles and permissions](#additional-roles-and-permissions).

Consult the [Role recommendations](#role-recommendations) section for best practices in which roles to assign to which users in your SOC.

## Custom roles and advanced Azure RBAC

- **Custom roles**. In addition to, or instead of, using Azure built-in roles, you can create Azure custom roles for Microsoft Sentinel. Azure custom roles for Microsoft Sentinel are created the same way you create other [Azure custom roles](../role-based-access-control/custom-roles-rest.md#create-a-custom-role), based on [specific permissions to Microsoft Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and to [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

- **Log Analytics RBAC**. You can use the Log Analytics advanced Azure role-based access control across the data in your Microsoft Sentinel workspace. This includes both data type-based Azure RBAC and resource-context Azure RBAC. For more information, see:

    - [Manage log data and workspaces in Azure Monitor](../azure-monitor/logs/manage-access.md#manage-access-using-workspace-permissions)

    - [Resource-context RBAC for Microsoft Sentinel](resource-context-rbac.md)
    - [Table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043)

    Resource-context and table-level RBAC are two methods of providing access to specific data in your Microsoft Sentinel workspace without allowing access to the entire Microsoft Sentinel experience.

## Role recommendations

After understanding how roles and permissions work in Microsoft Sentinel, you may want to use the following best practice guidance for applying roles to your users:

|User type  |Role |Resource group  |Description  |
|---------|---------|---------|---------|
|**Security analysts**     | [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)        | Microsoft Sentinel's resource group        | View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents.        |
|     | [Logic Apps Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules and run playbooks. <br><br>**Note**: This role also allows users to modify playbooks.         |
|**Security engineers**     | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)       |Microsoft Sentinel's resource group         |   View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents. <br><br>Create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.      |
|     | [Logic Apps Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules and run playbooks. <br><br>**Note**: This role also allows users to modify playbooks.         |
|  **Service Principal**   | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)      |  Microsoft Sentinel's resource group       | Automated configuration for management tasks |


> [!TIP]
> Additional roles may be required depending on the data you are ingesting or monitoring. For example, Azure AD roles may be required, such as the global admin or security admin roles, to set up data connectors for services in other Microsoft portals.
>

## Next steps

In this document, you learned how to work with roles for Microsoft Sentinel users and what each role enables users to do.

Find blog posts about Azure security and compliance at the [Microsoft Sentinel Blog](https://aka.ms/azuresentinelblog).
