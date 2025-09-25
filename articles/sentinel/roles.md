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

This article explains how Microsoft Sentinel assigns permissions to user roles for both Microsoft Sentinel SIEM and Microsoft Sentinel data lake, identifying the allowed actions for each role.

Microsoft Sentinel uses [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/) to provide built-in and custom roles for Microsoft Sentinel SIEM, and [Microsoft Entra ID role-based access control (Microsoft Entra ID RBAC)](/entra/identity/role-based-access-control/custom-overview) to provide built-in and custom roles for Microsoft Sentinel data lake. Roles can be assigned to users, groups, and services in either [Azure](/azure/role-based-access-control/role-assignments-steps) or [Microsoft Entra ID](/entra/identity/role-based-access-control/manage-roles-portal?tabs=admin-center), respectively.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

> [!IMPORTANT]
> Microsoft recommends that you use roles with the fewest permissions. This helps improve security for your organization. Global Administrator is a highly privileged role that should be limited to emergency scenarios when you can't use an existing role.

## Built-in Azure roles for Microsoft Sentinel

The following built-in Azure roles are used for Microsoft Sentinel SIEM and grant read access to the workspace data, including support for the Microsoft Sentinel data lake. Assign these roles at the resource group level for best results.

| Role | SIEM support | Data lake support |
|------|----------------------|------------------|
| [**Microsoft Sentinel Reader**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader) | View data, incidents, workbooks, and other resources | Access advanced analytics and run interactive queries on workspaces only. |
| [**Microsoft Sentinel Responder**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder) | All Reader permissions, plus manage incidents | N/A |
| [**Microsoft Sentinel Contributor**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) | All Responder permissions, plus install/update solutions, create/edit resources | Access advanced analytics and run interactive queries on workspaces only. |
| [**Microsoft Sentinel Playbook Operator**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-playbook-operator) | List, view, and manually run playbooks | N/A |
| [**Microsoft Sentinel Automation Contributor**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-automation-contributor) | Allows Microsoft Sentinel to add playbooks to automation rules. Not used for user accounts. | N/A |

For example, the following table shows examples of tasks that each role can perform in Microsoft Sentinel:

| Role | Run playbooks | Create/edit playbooks | Create/edit analytics rules, workbooks, etc. | Manage incidents | View data, incidents, workbooks | Manage content hub |
|------|--------------|----------------------|----------------------------------------------|------------------|-------------------------------|-------------------|
| [**Microsoft Sentinel Reader**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader) | -- | -- | --* | -- | ✓ | -- |
| [**Microsoft Sentinel Responder**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder) | -- | -- | --* | ✓ | ✓ | -- |
| [**Microsoft Sentinel Contributor**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) | -- | -- | ✓ | ✓ | ✓ | ✓ |
| [**Microsoft Sentinel Playbook Operator**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-playbook-operator) | ✓ | -- | -- | -- | -- | -- |
| [**Logic App Contributor**](/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor) | ✓ | ✓ | -- | -- | -- | -- |

*With [Workbook Contributor](/azure/role-based-access-control/built-in-roles#workbook-contributor) role.

We recommend that you assign roles to the resource group that contains the Microsoft Sentinel workspace. This ensures that all related resources, such as Logic Apps and playbooks, are covered by the same role assignments.

As another option, assign the roles directly to the Microsoft Sentinel **workspace** itself. If you do that, you must assign the same roles to the SecurityInsights **solution resource** in that workspace. You might also need to assign them to other resources, and continually manage role assignments to the resources.

### Additional roles for specific tasks

Users with particular job requirements might need to be assigned other roles or specific permissions in order to accomplish their tasks. For example:

| Task | Required roles/permissions |
|------|---------------------------|
| **Connect data sources** | **Write** permission on the workspace. Check connector docs for extra permissions required per connector. |
| **Manage content from Content hub** | [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) at the resource group level |
| **Automate responses with playbooks** | [Microsoft Sentinel Playbook Operator](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-playbook-operator), to run playbooks, and [Logic App Contributor](/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor) to create/edit playbooks. <br><br> Microsoft Sentinel uses playbooks for automated threat response. Playbooks are built on Azure Logic Apps, and are a separate Azure resource. For specific members of your security operations team, you might want to assign the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations.|
| **Allow Microsoft Sentinel to run playbooks via automation** | Service account needs explicit permissions to playbook resource group; your account needs [Owner](/azure/role-based-access-control/built-in-roles#owner) permissions to assign these. <br><br>Microsoft Sentinel uses a special service account to run incident-trigger playbooks manually or to call them from automation rules. The use of this account (as opposed to your user account) increases the security level of the service. <br><br>For an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule can run any playbook in that resource group. |
| **Guest users assign incidents** | [Directory Reader](/entra/identity/role-based-access-control/permissions-reference) AND [Microsoft Sentinel Responder](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder) <br><br>The Directory Reader role isn't an Azure role but a Microsoft Entra ID role, and regular (nonguest) users have this role assigned by default.|
| **Create/delete workbooks** | [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) or a lesser Microsoft Sentinel role AND [Workbook Contributor](/azure/role-based-access-control/built-in-roles#workbook-contributor) |

### Other Azure and Log Analytics roles

When you assign Microsoft Sentinel-specific Azure roles, you might come across other Azure and Log Analytics roles that might be assigned to users for other purposes. These roles grant a wider set of permissions that include access to your Microsoft Sentinel workspace and other resources:

- **Azure roles:** [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), [Reader](/azure/role-based-access-control/built-in-roles#reader) – grant broad access across Azure resources.
- **Log Analytics roles:** [Log Analytics Contributor](/azure/role-based-access-control/built-in-roles#log-analytics-contributor), [Log Analytics Reader](/azure/role-based-access-control/built-in-roles#log-analytics-reader) – grant access to Log Analytics workspaces.

> [!IMPORTANT]
> Role assignments are cumulative. A user with both **Microsoft Sentinel Reader** and **Contributor** roles may have more permissions than intended.

### Recommended role assignments for Microsoft Sentinel users

| User type | Role | Resource group | Description |
|-----------|------|---------------|-------------|
| **Security analysts** | [Microsoft Sentinel Responder](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder) | Microsoft Sentinel resource group | View/manage incidents, data, workbooks |
|  | [Microsoft Sentinel Playbook Operator](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-playbook-operator) | Microsoft Sentinel/playbook resource group | Attach/run playbooks |
| **Security engineers** |[Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor)  | Microsoft Sentinel resource group | Manage incidents, content, resources |
|  | [Logic App Contributor](/azure/role-based-access-control/built-in-roles/integration#logic-app-contributor) | Microsoft Sentinel/playbook resource group | Run/modify playbooks |
| **Service Principal** | [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor)  | Microsoft Sentinel resource group | Automated management tasks |

## Roles and permissions for the Microsoft Sentinel data lake (preview)

To use the Microsoft Sentinel data lake, your workspace must be [onboarded to the Defender portal](/unified-secops-platform/microsoft-sentinel-onboard?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json) and the [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md).


### Microsoft Sentinel data lake read permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. Use the following roles to provide read access to all workspaces within the Microsoft Sentinel data lake, such as for running queries.

|Permission type  |Supported roles  |
|---------|---------|
|**Read access across all workspaces**     | Use any of the following Microsoft Entra ID roles: <br><br>- [Global reader](/entra/identity/role-based-access-control/permissions-reference#global-reader)<br>- [Security reader](/azure/role-based-access-control/built-in-roles/security#security-reader)<br>- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)<br>  - [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)<br>  - [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)         |

Alternatively, you might want to assign the ability to read tables from within a specific workspace. In such cases, use one of the following:

|Tasks   |Permissions |
|---------|---------|
|**Read permissions on the default workspace**     | Use a [custom Microsoft Defender XDR unified RBAC role with ](/defender-xdr/custom-permissions-details)*[data (read)](/defender-xdr/custom-permissions-details)* permissions over the Microsoft Sentinel data collection.     |
|**Read permissions on any other workspace enabled for Microsoft Sentinel in the data lake**     | Use one of the following built-in roles in Azure RBAC for permissions on that workspace: <br>- [Log Analytics Reader](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-reader) <br>- [Log Analytics Contributor](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-contributor) <br>- [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles/security#microsoft-sentinel-contributor) <br>- [Microsoft Sentinel Reader](/azure/role-based-access-control/built-in-roles/security#microsoft-sentinel-reader) <br>- [Reader](/azure/role-based-access-control/built-in-roles/general#reader)<br>- [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor)<br>- [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner)|


### Microsoft Sentinel data lake write permissions

Microsoft Entra ID roles provides broad access across all workspaces in the data lake. Use the following roles to provide write access to the Microsoft Sentinel data lake tables:

|Permission type  |Supported roles  |
|---------|---------|
|**Write to tables in the analytics tier using KQL jobs or notebooks**     |  Use one of the following Microsoft Entra ID roles: <br><br> - [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)<br>- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) <br>- [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)      |
|**Write to tables in the Microsoft Sentinel data lake**     |  Use one of the following Microsoft Entra ID roles: <br>- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator) <br>- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator) <br>- [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)        |

Alternatively, you might want to assign the ability to write output to a specific workspace. This can include the ability to configure connectors to that workspace, modifying retention settings for tables in the workspace, or creating, updating, and deleting custom tables in that workspace. In such cases, use one of the following:

|Tasks  |Permissions |
|---------|---------|
|**For edit permissions on the default workspace**     |   Use a [custom Microsoft Defender XDR unified RBAC role with *data (manage)*](https://aka.ms/data-lake-custom-urbac) permissions over the Microsoft Sentinel data collection.       |
|**For any other Microsoft Sentinel workspace in the data lake**     |  Use any built-in or custom role that includes the following Azure RBAC  [Microsoft operational insights](/azure/role-based-access-control/permissions/monitor#microsoftoperationalinsights) permissions on that workspace:<br>    - *microsoft.operationalinsights/workspaces/write*<br>   - *microsoft.operationalinsights/workspaces/tables/write*<br>    - *microsoft.operationalinsights/workspaces/tables/delete* <br><br>For example, built-in roles that include these permissions [Log Analytics Contributor](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-contributor), [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner), and [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor).       |

### Manage jobs in the Microsoft Sentinel data lake

To create scheduled jobs or to manage jobs in the Microsoft Sentinel data lake, you must have one of the following Microsoft Entra ID roles:

- [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)
- [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)
- [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

## Custom roles and advanced RBAC

To restrict access to specific data, but not the whole workspace, use [resource-context RBAC](resource-context-rbac.md) or [Table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043). This is useful for teams needing access to only certain data types or tables.

Otherwise, use one of the following options for advanced RBAC:

- For Microsoft Sentinel SIEM access, use [Azure custom roles](/azure/role-based-access-control/custom-roles).
- For the Microsoft Sentinel data lake, use [Defender XDR unified RBAC custom roles](/defender-xdr/create-custom-rbac-roles).

## Related content

For more information, see [Manage log data and workspaces in Azure Monitor](/azure/azure-monitor/logs/manage-access#azure-rbac)

> [!div class="nextstepaction"]
> [Plan costs](billing.md)
