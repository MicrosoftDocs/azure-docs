---
title: Roles and permissions in Microsoft Sentinel
description: Learn how Microsoft Sentinel assigns permissions to users using Azure role-based access control, and identify the allowed actions for each role.
author: yelevin
ms.topic: conceptual
ms.date: 09/29/2023
ms.author: yelevin
---

# Roles and permissions in Microsoft Sentinel

This article explains how Microsoft Sentinel assigns permissions to user roles and identifies the allowed actions for each role. Microsoft Sentinel uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) to provide [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Use Azure RBAC to create and assign roles within your security operations team to grant appropriate access to Microsoft Sentinel. The different roles give you fine-grained control over what Microsoft Sentinel users can see and do. Azure roles can be assigned in the Microsoft Sentinel workspace directly (see note below), or in a subscription or resource group that the workspace belongs to, which Microsoft Sentinel inherits.

## Roles and permissions for working in Microsoft Sentinel

### Microsoft Sentinel-specific roles

**All Microsoft Sentinel built-in roles grant read access to the data in your Microsoft Sentinel workspace.**

- [**Microsoft Sentinel Reader**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader) can view data, incidents, workbooks, and other Microsoft Sentinel resources.

- [**Microsoft Sentinel Responder**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) can, in addition to the above, manage incidents (assign, dismiss, etc.).

- [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) can, in addition to the above, install and update solutions from content hub, create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.

- [**Microsoft Sentinel Playbook Operator**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) can list, view, and manually run playbooks.

- [**Microsoft Sentinel Automation Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-automation-contributor) allows Microsoft Sentinel to add playbooks to automation rules. It isn't meant for user accounts.

> [!NOTE]
>
> - For best results, assign these roles to the **resource group** that contains the Microsoft Sentinel workspace. This way, the roles apply to all the resources that support Microsoft Sentinel, as those resources should also be placed in the same resource group.
>
> - As another option, assign the roles directly to the Microsoft Sentinel **workspace** itself. If you do this, you must also assign the same roles to the SecurityInsights **solution resource** in that workspace. You may need to assign them to other resources as well, and you will need to constantly manage role assignments to resources.

### Other roles and permissions

Users with particular job requirements may need to be assigned other roles or specific permissions in order to accomplish their tasks.

- **Install and manage out-of-the-box content**

    Find packaged solutions for end-to-end products or standalone content from the content hub in Microsoft Sentinel. To install and manage content from the content hub, assign the **Microsoft Sentinel Contributor** role at the resource group level. For some solutions, the [**Template Spec Contributor**](../role-based-access-control/built-in-roles.md#template-spec-contributor) role is still required.
 
- **Automate responses to threats with playbooks**

    Microsoft Sentinel uses playbooks for automated threat response. Playbooks are built on Azure Logic Apps, and are a separate Azure resource. For specific members of your security operations team, you might want to assign the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations. You can use the [**Microsoft Sentinel Playbook Operator**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) role to assign explicit, limited permission for running playbooks, and the [**Logic App Contributor**](../role-based-access-control/built-in-roles.md#logic-app-contributor) role to create and edit playbooks.

- **Give Microsoft Sentinel permissions to run playbooks**

    Microsoft Sentinel uses a special service account to run incident-trigger playbooks manually or to call them from automation rules. The use of this account (as opposed to your user account) increases the security level of the service.

    For an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule can run any playbook in that resource group. To grant these permissions to this service account, your account must have **Owner** permissions to the resource groups containing the playbooks.

- **Connect data sources to Microsoft Sentinel**

    For a user to add data connectors, you must assign the user **Write** permissions on the Microsoft Sentinel workspace. Notice the required extra permissions for each connector, as listed on the relevant connector page.

- **Allow guest users to assign incidents**

    If a guest user needs to be able to assign incidents, you need to assign the [**Directory Reader**](../active-directory/roles/permissions-reference.md#directory-readers) to the user, in addition to the **Microsoft Sentinel Responder** role. Note that the Directory Reader role is *not* an Azure role but a Microsoft Entra role, and that regular (non-guest) users have this role assigned by default.

- **Create and delete workbooks**

    To create and delete a Microsoft Sentinel workbook, the user needs either the **Microsoft Sentinel Contributor** role or a lesser Microsoft Sentinel role, together with the [**Workbook Contributor**](../role-based-access-control/built-in-roles.md#workbook-contributor) Azure Monitor role. This role isn't necessary for *using* workbooks, only for creating and deleting.

### Azure and Log Analytics roles you might see assigned

When you assign Microsoft Sentinel-specific Azure roles, you may come across other Azure and Log Analytics roles that may have been assigned to users for other purposes. Note that these roles grant a wider set of permissions that include access to your Microsoft Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), and [Reader](../role-based-access-control/built-in-roles.md#reader). Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Microsoft Sentinel resources.

- **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor) and [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader). Log Analytics roles grant access to your Log Analytics workspaces.

For example, a user assigned the **Microsoft Sentinel Reader** role, but not the **Microsoft Sentinel Contributor** role, can still edit items in Microsoft Sentinel, if that user is also assigned the Azure-level **Contributor** role. Therefore, if you want to grant permissions to a user only in Microsoft Sentinel, carefully remove this user’s prior permissions, making sure you do not break any needed access to another resource.

## Microsoft Sentinel roles, permissions, and allowed actions

This table summarizes the Microsoft Sentinel roles and their allowed actions in Microsoft Sentinel.

| Role | View and run playbooks | Create and edit playbooks | Create and edit analytics rules, workbooks, and other Microsoft Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, workbooks, and other Microsoft Sentinel resources | Install and manage content from the content hub|
|---|---|---|---|---|---|--|
| Microsoft Sentinel Reader | -- | -- | --[*](#workbooks) | -- | &#10003; | --|
| Microsoft Sentinel Responder | -- | -- | --[*](#workbooks) | &#10003; | &#10003; | --|
| Microsoft Sentinel Contributor | -- | -- | &#10003; | &#10003; | &#10003; | &#10003;|
| Microsoft Sentinel Playbook Operator | &#10003; | -- | -- | -- | -- | --|
| Logic App Contributor | &#10003; | &#10003; | -- | -- | -- |-- |
| Template Spec Contributor |  -- |  -- | -- | -- | -- |&#10003;[**](#content-hub)  |

<a name=workbooks></a>* Users with these roles can create and delete workbooks with the [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) role. Learn about [Other roles and permissions](#other-roles-and-permissions).

<a name=content-hub></a>** The requirement for the Template Spec Contributor role to install and manage content from content hub is still required for some edge cases in addition to Microsoft Sentinel Contributor.

Review the [role recommendations](#role-and-permissions-recommendations) for which roles to assign to which users in your SOC.

## Custom roles and advanced Azure RBAC

- **Custom roles**. In addition to, or instead of, using Azure built-in roles, you can create Azure custom roles for Microsoft Sentinel. You create Azure custom roles for Microsoft Sentinel in the same way as [Azure custom roles](../role-based-access-control/custom-roles-rest.md#create-a-custom-role), based on [specific permissions to Microsoft Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and to [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

- **Log Analytics RBAC**. You can use the Log Analytics advanced Azure RBAC across the data in your Microsoft Sentinel workspace. This includes both data type-based Azure RBAC and resource-context Azure RBAC. To learn more:

    - [Manage log data and workspaces in Azure Monitor](../azure-monitor/logs/manage-access.md#azure-rbac)
    - [Resource-context RBAC for Microsoft Sentinel](resource-context-rbac.md)
    - [Table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043)

    Resource-context and table-level RBAC are two ways to give access to specific data in your Microsoft Sentinel workspace, without allowing access to the entire Microsoft Sentinel experience.

## Role and permissions recommendations

After understanding how roles and permissions work in Microsoft Sentinel, you can review these best practices for applying roles to your users:

| User type  | Role | Resource group  | Description  |
| --------- | --------- | --------- | --------- |
| **Security analysts**     | [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)        | Microsoft Sentinel's resource group        | View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents.        |
|     | [Microsoft Sentinel Playbook Operator](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules. <br>Run playbooks.        |
|**Security engineers**     | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)       |Microsoft Sentinel's resource group         |   View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents. <br><br>Create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.<br><br>Install and update solutions from content hub.  |
|     | [Logic Apps Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules. <br>Run and modify playbooks.         |
||[Template Spec Contributor](../role-based-access-control/built-in-roles.md#template-spec-contributor)|Microsoft Sentinel's resource group    |Install and manage content from the content hub.|
|  **Service Principal**   | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)      |  Microsoft Sentinel's resource group       | Automated configuration for management tasks |


> [!TIP]
> More roles may be required depending on the data you ingest or monitor. For example, Microsoft Entra roles may be required, such as the global admin or security admin roles, to set up data connectors for services in other Microsoft portals.
>

## Resource-based access control

You may have some users who need to access only specific data in your Microsoft Sentinel workspace, but shouldn't have access to the entire Microsoft Sentinel environment. For example, you may want to provide a non-security operations (non-SOC) team with access to the Windows event data for the servers they own.

In such cases, we recommend that you configure your role-based access control (RBAC) based on the resources that are allowed to your users, instead of providing them with access to the Microsoft Sentinel workspace or specific Microsoft Sentinel features. This method is also known as setting up resource-context RBAC. [Learn more about RBAC](resource-context-rbac.md)

## Next steps

In this article, you learned how to work with roles for Microsoft Sentinel users and what each role enables users to do.

> [!div class="nextstepaction"]
> >[Plan costs](billing.md)
