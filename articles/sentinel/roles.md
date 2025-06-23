---
title: Roles and permissions in the Microsoft Sentinel platform
description: Learn how Microsoft Sentinel assigns permissions to users using both Azure and Microsoft Entra ID role-based access control, and identify the allowed actions for each role.
author: batamig
ms.topic: conceptual
ms.date: 06/19/2025
ms.author: bagol
ms.collection: usx-security
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal


#Customer intent: As a security operations manager, I want to assign appropriate roles and permissions in Microsoft Sentinel so that my team can effectively manage incidents, automate responses, and access necessary data without compromising security.

---

# Roles and permissions in the Microsoft Sentinel platform

This article explains how Microsoft Sentinel assigns permissions to user roles for both Microsoft Sentinel and the Microsoft Sentinel data lake, identifying the allowed actions for each role. 

Microsoft Sentinel uses [Azure role-based access control (Azure RBAC)](../role-based-access-control) to provide [built-in roles](../role-based-access-control/built-in-roles.md) for Microsoft Sentinel use cases, and [Microsoft Entra ID role-based access control (Microsoft Entra ID RBAC)](/entra/identity/role-based-access-control/custom-overview) to provide [built-in roles](/entra/identity/role-based-access-control/permissions-reference) for Microsoft Sentinel data lake use cases. Some built-in Azure roles also provide access to the Microsoft Sentinel data lake.

Built-in roles can be assigned to users, groups, and services in either [Azure](/azure/role-based-access-control/role-assignments-steps) or [Microsoft Entra ID](/entra/identity/role-based-access-control/manage-roles-portal?tabs=admin-center).

This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Azure roles for Microsoft Sentinel and Microsoft Sentinel data lake use cases

The following built-in Azure roles are used specifically for Microsoft Sentinel, and all grant read access to the data in your Microsoft Sentinel workspace.

|Role name  |Core Microsoft Sentinel support |Microsoft Sentinel data lake support  |
|---------|---------|---------|
|[**Microsoft Sentinel Reader**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader)     |  In Microsoft Sentinel, this role can view data, incidents, workbooks, and other Microsoft Sentinel resources.       |    In the Microsoft Sentinel data lake, this role can access advanced analytics and run interactive queries on workspaces. <br><br>This role doesn't support running interactive queries on the default lake store.     |
|[**Microsoft Sentinel Responder**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)     |  In Microsoft Sentinel, this role can, in addition to the permissions for Microsoft Sentinel Reader, manage incidents like assign, dismiss, and change incidents.       |  N/A       |
|[**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)     |   In Microsoft Sentinel, this role can, in addition to the permissions for Microsoft Sentinel Responder, install and update solutions from content hub, and create and edit Microsoft Sentinel resources like workbooks, analytics rules, and more.      |    In the Microsoft Sentinel data lake, this role can access advanced analytics and run interactive queries on workspaces. <br><br>This role doesn't support running interactive queries on the default lake store.     |
|[**Microsoft Sentinel Playbook Operator**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator)     | In Microsoft Sentinel, this role can list, view, and manually run playbooks.        |    N/A     |
|[**Microsoft Sentinel Automation Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-automation-contributor)     |   In Microsoft Sentinel, this role allows Microsoft Sentinel to add playbooks to automation rules. It isn't meant for user accounts.      |  N/A       |

For best results, assign these roles to the **resource group** that contains the Microsoft Sentinel workspace. This way, the roles apply to all the resources that support Microsoft Sentinel, as those resources should also be placed in the same resource group.

As another option, assign the roles directly to the Microsoft Sentinel **workspace** itself. If you do that, you must assign the same roles to the SecurityInsights **solution resource** in that workspace. You might also need to assign them to other resources, and continually manage role assignments to the resources.

### Extra Azure roles and permissions per task

Users with particular job requirements might need to be assigned other roles or specific permissions in order to accomplish their tasks. For example:

|Task |Permissions required  |
|---------|---------|
|**Connect data sources to Microsoft Sentinel**     |  For a user to add data connectors, you must assign the user **Write** permissions on the Microsoft Sentinel workspace. <br><br>Notice the required extra permissions for each connector, as listed on the relevant connector page.       |
|**Install and manage out-of-the-box content**     |    Find packaged solutions for end-to-end products or standalone content from the content hub in Microsoft Sentinel. <br><br>To install and manage content from the content hub, assign the **Microsoft Sentinel Contributor** role at the resource group level.     |
|**Automate responses to threats with playbooks**     |   Microsoft Sentinel uses playbooks for automated threat response. Playbooks are built on Azure Logic Apps, and are a separate Azure resource. <br><br>For specific members of your security operations team, you might want to assign the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations. <br><br>You can use the [**Microsoft Sentinel Playbook Operator**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) role to assign explicit, limited permission for running playbooks, and the [**Logic App Contributor**](../role-based-access-control/built-in-roles.md#logic-app-contributor) role to create and edit playbooks.      |
|**Give Microsoft Sentinel permissions to run playbooks**     |   Microsoft Sentinel uses a special service account to run incident-trigger playbooks manually or to call them from automation rules. The use of this account (as opposed to your user account) increases the security level of the service. <br><br>For an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule can run any playbook in that resource group. To grant these permissions to this service account, your account must have **Owner** permissions to the resource groups containing the playbooks.      |
|**Allow guest users to assign incidents**     |      If a guest user needs to be able to assign incidents, you need to assign the [**Directory Reader**](../active-directory/roles/permissions-reference.md#directory-readers) role to the user, in addition to the **Microsoft Sentinel Responder** role. The Directory Reader role isn't an Azure role but a Microsoft Entra role, and regular (nonguest) users have this role assigned by default.  |
|**Create and delete workbooks**     |     To create and delete a Microsoft Sentinel workbook, the user needs either the **Microsoft Sentinel Contributor** role or a lesser Microsoft Sentinel role, together with the [**Workbook Contributor**](../role-based-access-control/built-in-roles.md#workbook-contributor) Azure Monitor role. This role isn't necessary for *using* workbooks, only for creating and deleting.    |

### Azure and Log Analytics roles you might see assigned

When you assign Microsoft Sentinel-specific Azure roles, you might come across other Azure and Log Analytics roles that might be assigned to users for other purposes. These roles grant a wider set of permissions that include access to your Microsoft Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), and [Reader](../role-based-access-control/built-in-roles.md#reader). Azure roles grant access across all your Azure resources, including Log Analytics workspaces and Microsoft Sentinel resources.

- **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor) and [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader). Log Analytics roles grant access to your Log Analytics workspaces.

For example, a user assigned the **Microsoft Sentinel Reader** role, but not the **Microsoft Sentinel Contributor** role, can still edit items in Microsoft Sentinel, if that user is also assigned the Azure-level **Contributor** role. Therefore, if you want to grant permissions to a user only in Microsoft Sentinel, carefully remove this user’s prior permissions, making sure you don't break any needed access to another resource.

### Resource-based access control with Azure RBAC

You might have some users who need to access only specific data in your Microsoft Sentinel workspace or data lake, but shouldn't have access to the entire Microsoft Sentinel environment. For example, you might want to provide a team outside of security operations with access to the Windows event data for the servers they own.

In such cases, we recommend that you configure your role-based access control (RBAC) based on the resources that are allowed to your users, instead of providing them with access to the Microsoft Sentinel workspace or specific Microsoft Sentinel features. This method is also known as setting up resource-context RBAC. For more information, see [Manage access to Microsoft Sentinel data by resource](resource-context-rbac.md).

## Microsoft Entra ID roles for Microsoft Sentinel data lake use cases

To use Microsoft Sentinel data lake, your workspace must be [onboarded to the Defender portal](unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) and to the [Microsoft Sentinel data lake](tbd.md).

### Read permissions for Microsoft Sentinel data lake

[!INCLUDE [sentinel-data-lake-read-permissions](includes/sentinel-data-lake-read-permissions.md)]

## Write permissions for Microsoft Sentinel data lake

[!INCLUDE [sentinel-data-lake-KQL-write-permissions](includes/sentinel-data-lake-KQL-write-permissions.md)]

[!INCLUDE [sentinel-data-lake-notebook-write-permissions](includes/sentinel-data-lake-notebook-write-permissions.md)]

[!INCLUDE [sentinel-data-lake-job-permissions](includes/sentinel-data-lake-job-permissions.md)]

## Summary tables and recommendations

The following tables summarize Microsoft Sentinel and Microsoft Sentinel data lake roles and permissions, and provide recommendations for assigning roles to users in your security operations center (SOC).

### Reference of Azure roles, permissions, and allowed actions for Microsoft Sentinel

The following table summarizes the Microsoft Sentinel roles and their allowed actions in Microsoft Sentinel.

| Role | View and run playbooks | Create and edit playbooks | Create and edit analytics rules, workbooks, and other Microsoft Sentinel resources | Manage incidents (dismiss, assign, etc.) | View data, incidents, workbooks, and other Microsoft Sentinel resources | Install and manage content from the content hub|
|---|---|---|---|---|---|--|
| [Microsoft Sentinel Reader](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader) | -- | -- | --[*](#workbooks) | -- | &#10003; | --|
| [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)  | -- | -- | --[*](#workbooks) | &#10003; | &#10003; | --|
| [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) | -- | -- | &#10003; | &#10003; | &#10003; | &#10003;|
| [Microsoft Sentinel Playbook Operator](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) | &#10003; | -- | -- | -- | -- | --|
| [Logic App Contributor](/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor) | &#10003; | &#10003; | -- | -- | -- |-- |

<a name=workbooks></a>* Users with these roles can create and delete workbooks with the [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) role.

### Recommendations for Azure roles and permissions for Microsoft Sentinel use cases

The following table provides recommendations for assigning roles and permissions to users in your security operations center (SOC) for Microsoft Sentinel. 

| User type  | Role | Resource group  | Description  |
| --------- | --------- | --------- | --------- |
| **Security analysts**     | [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)        | Microsoft Sentinel's resource group        | View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents.        |
|     | [Microsoft Sentinel Playbook Operator](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules. <br>Run playbooks.        |
|**Security engineers**     | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)       |Microsoft Sentinel's resource group         |   View data, incidents, workbooks, and other Microsoft Sentinel resources. <br><br>Manage incidents, such as assigning or dismissing incidents. <br><br>Create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.<br><br>Install and update solutions from content hub.  |
|     | [Logic Apps Contributor](../role-based-access-control/built-in-roles.md#logic-app-contributor)        | Microsoft Sentinel's resource group, or the resource group where your playbooks are stored        | Attach playbooks to analytics and automation rules. <br>Run and modify playbooks.         |
|  **Service Principal**   | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)      |  Microsoft Sentinel's resource group       | Automated configuration for management tasks |

More roles might be required depending on the data you ingest or monitor. For example, Microsoft Entra roles might be required, such as the [Security Administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) role, to [manage multiple workspaces](workspaces-defender-portal.md#permissions-to-manage-workspaces-and-view-workspace-data), or to set up data connectors for services in other Microsoft portals.

## Summary of Microsoft Sentinel data lake roles and permissions

The following tables summarize permissions for the Microsoft Sentinel data lake, including both Azure and Microsoft Entra ID built-in roles, and extra Microsoft Defender XDR unified role-based access control (RBAC) roles.

|Roles  |Supported tasks  |
|---------|---------|
|[Microsoft Entra ID Global Reader](/entra/identity/role-based-access-control/permissions-reference#global-reader) <br>OR<br>[Microsoft Entra ID Security Reader](/entra/identity/role-based-access-control/permissions-reference#security-reader)     |   - Access advanced analytics <br>- Run interactive queries on the default lake <br>- Run interactive queries on the workspace      |
|[Microsoft Entra ID Global Administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator) <br>OR<br>[Microsoft Entra ID Security Administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) <br>OR<br> [Microsoft Entra ID Security Operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)|  - Access advanced analytics <br>- Run interactive queries on the default lake <br>- Run interactive queries on the workspace <br>- Write output to the default data lake <br>- Write output to the Log Analytics workspace <br>- Schedule job management <br>- Set table retention <br>- Configure data connector        |
|[Log Analytics Reader](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-reader) <br>OR<br> [Microsoft Sentinel Reader](/azure/role-based-access-control/built-in-roles/security#microsoft-sentinel-reader) <br>OR<br> [Reader](/azure/role-based-access-control/built-in-roles/general#reader)  |  - Access advanced analytics <br>- Run interactive queries on workspaces      |
|[Log Analytics contributor](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-contributor) <br>OR<br>[Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) <br>OR<br>[Owner](/azure/role-based-access-control/built-in-roles/privileged#owner)  |   - Access advanced analytics <br>- Run interactive queries on workspaces <br>- Write output to Log Analytics workspaces <br> Set table retention in Log Analytics workspaces <br> - Configure data connectors in the Log Analytics workspaces       |
|[Microsoft Entra ID Global Reader](/entra/identity/role-based-access-control/permissions-reference#global-reader) <br> OR <br>[Microsoft Entra ID Security Reader](/entra/identity/role-based-access-control/permissions-reference#security-reader)  <br>AND<br> [Microsoft Defender XDR unified RBAC data (manage)](tbd) <br>AND<br> [Microsoft Sentinel unified RBAC advanced analytics job (manage)](tbd) over Microsoft Sentinel data collection   |  - Access advanced analytics <br>- Run interactive queries on the default lake <br>- Run interactive queries on the workspace <br>- Write output to the default data lake <br>- Write output to the Log Analytics workspace <br>- Schedule job management <br>- Set table retention in default data lake <br>- Configure data connectors in the default data lake       |
|[Microsoft Defender XDR unified RBAC security data basics (read)](tbd) over Microsoft Sentinel data collection     |   - Access advanced analytics <br>- Run interactive queries on the default lake      |


## Custom roles and advanced RBAC

For Microsoft Sentinel use cases, use Azure RBAC in addition to or instead of Azure built-in roles to create and assign custom roles that grant relevant access as needed. Assign Azure custom roles directly in your workspace, or in the subscription or resource group that the your workspace belongs to.

Create Azure custom roles for Microsoft Sentinel using [specific permissions for Microsoft Sentinel](../role-based-access-control/resource-provider-operations.md#microsoftsecurityinsights) and [Azure Log Analytics resources](../role-based-access-control/resource-provider-operations.md#microsoftoperationalinsights).

You can also use the Log Analytics advanced Azure RBAC across the data in your Microsoft Sentinel workspace. This includes both data type-based Azure RBAC and resource-context Azure RBAC.  Resource-context and table-level RBAC are two ways to give access to specific data in your Microsoft Sentinel workspace, without allowing access to the entire Microsoft Sentinel experience.

For more information, see:

- [Azure custom roles](/azure/role-based-access-control/custom-roles)
- [Manage log data and workspaces in Azure Monitor](/azure/azure-monitor/logs/manage-access#azure-rbac)
- [Resource-context RBAC for Microsoft Sentinel](resource-context-rbac.md)
- [Table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043)

For Microsoft Sentinel data lake access, use Microsoft Defender XDR unified role-based access control (RBAC) to create and assign custom roles that grant relevant access as needed for Microsoft Sentinel data lake. For more information, see [Create custom roles with Microsoft Defender XDR Unified RBAC](/defender-xdr/create-custom-rbac-roles?view=o365-worldwide).

## Next steps

In this article, you learned how to work with roles for Microsoft Sentinel users and what each role enables users to do.

> [!div class="nextstepaction"]
> >[Plan costs](billing.md)
