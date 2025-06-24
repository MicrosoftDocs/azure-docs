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
---

# Roles and permissions in the Microsoft Sentinel platform

This article explains how Microsoft Sentinel assigns permissions to user roles for both Microsoft Sentinel and the Microsoft Sentinel data lake, identifying the allowed actions for each role.

Microsoft Sentinel uses [Azure role-based access control (Azure RBAC)](../role-based-access-control) to provide built-in and custom roles for Microsoft Sentinel, and [Microsoft Entra ID role-based access control (Microsoft Entra ID RBAC)](/entra/identity/role-based-access-control/custom-overview) to provide built-in and custom roles for Microsoft Sentinel data lake. Roles can be assigned to users, groups, and services in either [Azure](/azure/role-based-access-control/role-assignments-steps) or [Microsoft Entra ID](/entra/identity/role-based-access-control/manage-roles-portal?tabs=admin-center), respectively.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Built-in Azure roles for Microsoft Sentinel

The following built-in Azure roles are used for Microsoft Sentinel and grant read access to the workspace data, including support for the Microsoft Sentinel data lake. Assign these roles at the resource group level for best results.

| Role | Microsoft Sentinel support | Microsoft Sentinel data lake support |
|------|----------------------|------------------|
| [Microsoft Sentinel Reader](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader) | View data, incidents, workbooks, and other resources | Access advanced analytics and run interactive queries on workspaces only. |
| [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) | All Reader permissions, plus manage incidents | N/A |
| [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) | All Responder permissions, plus install/update solutions, create/edit resources | Access advanced analytics and run interactive queries on workspaces only. |
| [Microsoft Sentinel Playbook Operator](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) | List, view, and manually run playbooks | N/A |
| [Microsoft Sentinel Automation Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-automation-contributor) | Allows Microsoft Sentinel to add playbooks to automation rules. Not used for user accounts. | N/A |

For example, the following table shows examples of tasks that each role can perform in Microsoft Sentinel:

| Role | Run playbooks | Create/edit playbooks | Create/edit analytics rules, workbooks, etc. | Manage incidents | View data, incidents, workbooks | Manage content hub |
|------|--------------|----------------------|----------------------------------------------|------------------|-------------------------------|-------------------|
| [Microsoft Sentinel Reader](../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader) | -- | -- | --* | -- | ✓ | -- |
| [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) | -- | -- | --* | ✓ | ✓ | -- |
| [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) | -- | -- | ✓ | ✓ | ✓ | ✓ |
| [Playbook Operator](../role-based-access-control/built-in-roles.md#microsoft-sentinel-playbook-operator) | ✓ | -- | -- | -- | -- | -- |
| [Logic App Contributor](/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor) | ✓ | ✓ | -- | -- | -- | -- |

*With [Workbook Contributor](../role-based-access-control/built-in-roles.md#workbook-contributor) role.

We recommend that you assign roles to the resource group that contains the Microsoft Sentinel workspace. This ensures that all related resources, such as Logic Apps and playbooks, are covered by the same role assignments.

As another option, assign the roles directly to the Microsoft Sentinel **workspace** itself. If you do that, you must assign the same roles to the SecurityInsights **solution resource** in that workspace. You might also need to assign them to other resources, and continually manage role assignments to the resources.

### Additional roles for specific tasks

Users with particular job requirements might need to be assigned other roles or specific permissions in order to accomplish their tasks. For example:

| Task | Required roles/permissions |
|------|---------------------------|
| **Connect data sources** | **Write** permission on the workspace. Check connector docs for extra permissions required per connector. |
| **Manage content from Content hub** | **Microsoft Sentinel Contributor** at the resource group level |
| **Automate responses with playbooks** | **Microsoft Sentinel Playbook Operator**, to run playbooks, and **Logic App Contributor** to create/edit playbooks. <br><br> Microsoft Sentinel uses playbooks for automated threat response. Playbooks are built on Azure Logic Apps, and are a separate Azure resource. For specific members of your security operations team, you might want to assign the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations.|
| **Allow Microsoft Sentinel to run playbooks via automation** | Service account needs explicit permissions to playbook resource group; your account needs **Owner** permissions to assign these. <br><br>Microsoft Sentinel uses a special service account to run incident-trigger playbooks manually or to call them from automation rules. The use of this account (as opposed to your user account) increases the security level of the service. <br><br>For an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule can run any playbook in that resource group. |
| **Guest users assign incidents** | **Directory Reader** AND **Microsoft Sentinel Responder** <br><br>The Directory Reader role isn't an Azure role but a Microsoft Entra role, and regular (nonguest) users have this role assigned by default.|
| **Create/delete workbooks** | **Microsoft Sentinel Contributor** or a lesser Microsoft Sentinel role AND **Workbook Contributor** |

### Other Azure and Log Analytics roles

When you assign Microsoft Sentinel-specific Azure roles, you might come across other Azure and Log Analytics roles that might be assigned to users for other purposes. These roles grant a wider set of permissions that include access to your Microsoft Sentinel workspace and other resources:

- **Azure roles:** [Owner](../role-based-access-control/built-in-roles.md#owner), [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Reader](../role-based-access-control/built-in-roles.md#reader) – grant broad access across Azure resources.
- **Log Analytics roles:** [Log Analytics Contributor](../role-based-access-control/built-in-roles.md#log-analytics-contributor), [Log Analytics Reader](../role-based-access-control/built-in-roles.md#log-analytics-reader) – grant access to Log Analytics workspaces.

> [!IMPORTANT]
> Role assignments are cumulative. A user with both **Microsoft Sentinel Reader** and **Contributor** roles may have more permissions than intended.

### Recommended role assignments for Microsoft Sentinel users

| User type | Role | Resource group | Description |
|-----------|------|---------------|-------------|
| Security analysts | [Microsoft Sentinel Responder](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) | Microsoft Sentinel resource group | View/manage incidents, data, workbooks |
|  | Playbook Operator | Microsoft Sentinel/playbook resource group | Attach/run playbooks |
| Security engineers |[Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)  | Microsoft Sentinel resource group | Manage incidents, content, resources |
|  | Logic Apps Contributor | Microsoft Sentinel/playbook resource group | Run/modify playbooks |
| Service Principal | [Microsoft Sentinel Contributor](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)  | Microsoft Sentinel resource group | Automated management tasks |

## Roles and permissions for the Microsoft Sentinel data lake

To use the Microsoft Sentinel data lake, your workspace must be [onboarded to the Defender portal](unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) and the [Microsoft Sentinel data lake](tbd.md).


### Microsoft Sentinel data lake read permissions

Use the following roles to provide read access to the Microsoft Sentinel data lake, such as for running queries.

|Permission type  |Supported roles  |
|---------|---------|
|**Read access across all workspaces**     | Use any of the following Microsoft Entra ID roles: <br><br>- [Global reader](/entra/identity/role-based-access-control/permissions-reference#global-reader)<br>- [Security reader](/azure/role-based-access-control/built-in-roles/security#security-reader)<br>- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)<br>  - [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)<br>  - [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)         |
|**Read access across specific workspaces other than the default workspace**     |  Use any of the following Azure RBAC built-in roles:  <br>- [Log Analytics Reader](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-reader)<br>- [Reader](/azure/role-based-access-control/built-in-roles/general#reader) <br>- [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) <br>- [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner)        |

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To read tables across all workspaces in the data lake using interactive notebook queries, you must have one of the supported Microsoft Entra ID roles.

### Microsoft Sentinel data lake write permissions

Microsoft Entra ID roles provides broad access across all workspaces in the data lake. Use the following roles to provide write access to the Microsoft Sentinel data lake tables:

|Permission type  |Supported roles  |
|---------|---------|
|**Write to tables in the analytics tier using KQL jobs**     |  Use one of the following Microsoft Entra ID roles: <br><br> - [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)<br>- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) <br>- [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)      |
|**Write to tables in the Microsoft Sentinel data lake**     |  Use one of the following Microsoft Entra ID roles: <br>- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator) <br>- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) <br>[Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)        |

Alternatively, you might want to assign the ability to write output to a specific workspace, including creating, updating, and deleted tables in that workspace. In such cases, use one of the following:

- **For edit permissions on the default workspace**, use a custom Microsoft Defender XDR unified RBAC role with *data (manage)* permissions over the Microsoft Sentinel data collection. 

- **For any other Microsoft Sentinel workspace in the data lake**, use any built-in or custom role that includes the following Azure RBAC  [Microsoft operational insights](/azure/role-based-access-control/permissions/monitor#microsoftoperationalinsights) permissions on that workspace:

    - *Microsoft.operationalinsights/workspaces/write*
    - *microsoft.operationalinsights/workspaces/tables/write*
    - *microsoft.operationalinsights/workspaces/tables/delete* 

### Schedule jobs in the Microsoft Sentinel data lake

To schedule a job in the Microsoft Sentinel data lake, you must have one of the following Microsoft Entra ID roles:

- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)
- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)
- [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

## Custom roles and advanced RBAC

To restrict access to specific data, but not the whole workspace, use [resource-context RBAC](resource-context-rbac.md) or [Table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043). This is useful for teams needing access to only certain data types or tables.

Otherwise, use one of the following options for advanced RBAC:

- For Microsoft Sentinel access, use [Azure custom roles](/azure/role-based-access-control/custom-roles).
- For the Microsoft Sentinel data lake, use [Defender XDR unified RBAC custom roles](/defender-xdr/create-custom-rbac-roles?view=o365-worldwide).

## Related content

For more information, see [Manage log data and workspaces in Azure Monitor](/azure/azure-monitor/logs/manage-access#azure-rbac)

> [!div class="nextstepaction"]
> [Plan costs](billing.md)