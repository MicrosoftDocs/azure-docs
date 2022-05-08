---
title: Log Analytics workspace access control overview
description: Describes how access control is implemented in Log Analytics workspaces in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/05/2022

---

# Log Analytics workspace access control overview

With Azure role-based access control (Azure RBAC), you can grant users and groups only the amount of access they need to work with monitoring data in a workspace. Workspaces use a resource-context log model where every log record emitted by an Azure resource, is automatically associated with this resource. The workspace respects scoping and Azure RBAC based on the resources.



The data a user has access to is determined by a combination of factors that are listed in the following table. Each is further described in the sections below.

| Factor | Description |
|:---|:---|
| [Access mode](#access-mode) | Method the user uses to access the workspace.  Defines the scope of the data available and the access control mode that's applied. |
| [Access control mode](#access-control-mode) | Setting on the workspace that defines whether permissions are applied at the workspace or resource level. |
| [Permissions](./manage-access.md) | Permissions applied to individual or groups of users for the workspace or resource. Defines what data the user will have access to. |
| [Table level Azure RBAC](./manage-access.md#table-level-azure-rbac) | Optional granular permissions that apply to all users regardless of their access mode or access control mode. Defines which data types a user can access. |

## Access mode
The *access mode* refers to how a user accesses a Log Analytics workspace and defines the data they can access during the current session. The mode is determined according to the [scope](scope.md) you select in Log Analytics.

There are two access modes:

- **Workspace-context**: You can view all logs in the workspace that you have permission to. Queries in this mode are scoped to all data in all tables in the workspace. This is the access mode used when logs are accessed with the workspace as the scope, such as when you select **Logs** from the **Azure Monitor** menu in the Azure portal.

 - **Resource-context**: When you access the workspace for a particular resource, resource group, or subscription, such as when you select **Logs** from a resource menu in the Azure portal, you can view logs for only resources in all tables that you have access to. Queries in this mode are scoped to only data associated with that resource. This mode also enables granular Azure RBAC.

 
Records are only available in resource-context queries if they are associated with the relevant resource. You can check this association by running a query and verifying that the [_ResourceId](./log-standard-columns.md#_resourceid) column is populated.

There are known limitations with the following resources:

- Computers outside of Azure - Resource-context only supported with [Azure Arc for Servers](../../azure-arc/servers/index.yml).
- Application Insights - Supported for resource-context only when using [Workspace-based Application Insights resource](../app/create-workspace-resource.md)
- Service Fabric


### Comparing access modes

The following table summarizes the access modes:

| Issue | Workspace-context | Resource-context |
|:---|:---|:---|
| Who is each model intended for? | Central administration. Administrators who need to configure data collection and users who need access to a wide variety of resources. Also currently required for users who need to access logs for resources outside of Azure. | Application teams. Administrators of Azure resources being monitored. Allows them to focus on their resource without filtering. |
| What does a user require to view logs? | Permissions to the workspace. See **Workspace permissions** in [Manage access using workspace permissions](./manage-access.md#azure-rbac). | Read access to the resource. See **Resource permissions** in [Manage access using Azure permissions](./manage-access.md#mazure-rbac). Permissions can be inherited (such as from the containing resource group) or directly assigned to the resource. Permission to the logs for the resource will be automatically assigned. The user doesn't require access to the workspace.|
| What is the scope of permissions? | Workspace. Users with access to the workspace can query all logs in the workspace from tables that they have permissions to. See [Table access control](./manage-access.md#table-level-azure-rbac) | Azure resource. User can query logs for specific resources, resource groups, or subscription they have access to in any workspace but can't query logs for other resources. |
| How can user access logs? | <ul><li>Start **Logs** from **Azure Monitor** menu.</li></ul> <ul><li>Start **Logs** from **Log Analytics workspaces**.</li></ul> <ul><li>From Azure Monitor [Workbooks](../best-practices-analysis.md#workbooks).</li></ul> | <ul><li>Start **Logs** from the menu for the Azure resource. User will have access to data for that resource.</li></ul> <ul><li>Start **Logs** from **Azure Monitor** menu. User will have access to data for all resources they have access to.</li></ul> <ul><li>Start **Logs** from **Log Analytics workspaces**. User will have access to data for all resources they have access to.</li></ul> <ul><li>From Azure Monitor [Workbooks](../best-practices-analysis.md#workbooks).</li></ul> |

## Access control mode

The *Access control mode* is a setting on each workspace that defines how permissions are determined for the workspace.

* **Require workspace permissions**: This control mode does not allow granular Azure RBAC. For a user to access the workspace, they must be granted permissions to the workspace or to specific tables.

    If a user accesses the workspace following the [workspace-context mode](#access-mode), they have access to all data in any table they've been granted access to. If a user accesses the workspace following the [resource-context mode](#access-mode), they have access to only data for that resource in any table they've been granted access to.

    This is the default setting for all workspaces created before March 2019.

* **Use resource or workspace permissions**: This control mode allows granular Azure RBAC. Users can be granted access to only data associated with resources they can view by assigning Azure `read` permission. 

    When a user accesses the workspace in [workspace-context mode](#access-mode), workspace permissions apply. When a user accesses the workspace in [resource-context mode](#access-mode), only resource permissions are verified, and workspace permissions are ignored. Enable Azure RBAC for a user by removing them from workspace permissions and allowing their resource permissions to be recognized.

    This is the default setting for all workspaces created after March 2019.

    > [!NOTE]
    > If a user has only resource permissions to the workspace, they are only able to access the workspace using resource-context mode assuming the workspace access mode is set to **Use resource or workspace permissions**.

To learn how to change the access control mode in the portal, with PowerShell, or using a Resource Manager template, see [Configure access control mode](./manage-access.md#configure-access-control-mode).



## Next steps

To implement the security permissions and controls recommended in this guide, review [manage access to logs](./manage-access.md).
