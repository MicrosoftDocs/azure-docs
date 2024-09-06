---
title: "Azure role-based access control - Azure Managed Grafana"
titleSuffix: Azure Managed Grafana
description: This conceptual article introduces Azure role-based access control for Azure Managed Grafana resources.
#customer intent: As a Grafana user, I want to understand how Azure role-based access control (RBAC) works with Azure Managed Grafana so that I can manage access to Azure Managed Grafana workspaces.
author: maud-lv
ms.service: azure-managed-grafana
ms.topic: concept-article
ms.date: 06/28/2024
ms.author: malev
---

# Azure role-based access control within Azure Managed Grafana

Azure Managed Grafana supports [Azure role-based access control (RBAC)](../role-based-access-control/index.yml), an authorization system that lets you manage individual access to your Azure resources. 

Azure RBAC enables you to allocate varying permission levels to users, groups, service principals, or managed identities, for managing your Azure Managed Grafana resources.

## Azure Managed Grafana roles

The following built-in roles are available in Azure Managed Grafana, each providing different levels of access:

> [!div class="mx-tableFixed"]
> | Built-in role | Description | ID |
> | --- | --- | --- |
> | <a name='grafana-admin'></a>[Grafana Admin](../role-based-access-control/built-in-roles/monitor.md#grafana-admin) | Perform all Grafana operations, including the ability to manage data sources, create dashboards, and manage role assignments within Grafana. | 22926164-76b3-42b3-bc55-97df8dab3e41 |
> | <a name='grafana-editor'></a>[Grafana Editor](../role-based-access-control/built-in-roles/monitor.md#grafana-editor) | View and edit a Grafana instance, including its dashboards and alerts. | a79a5197-3a5c-4973-a920-486035ffd60f |
> | <a name='grafana-viewer'></a>[Grafana Viewer](../role-based-access-control/built-in-roles/monitor.md#grafana-viewer) | View a Grafana instance, including its dashboards and alerts. | 60921a7e-fef1-4a43-9b16-a26c52ad4769 |

To access the Grafana user interface, users must possess one of these roles. 

These permissions are included within the broader roles of resource group Contributor and resource group Owner roles. If you're not a resource group Contributor or resource group Owner, a User Access Administrator, you will need to ask a subscription Owner or resource group Owner to grant you one of the Grafana roles on the resource you want to access.

## Adding a role assignment to an Azure Managed Grafana resource

To add a role assignment to an Azure Managed Grafana instance, in your Azure Managed Grafana workspace, open the **Access control (IAM)** menu and select **Add** > **Add role assignment**.

:::image type="content" source="media/azure-ad-group-sync/add-role-assignment.png" alt-text="Screenshot of the Azure portal. Adding a new role assignment.":::

Assign a role, such as **Grafana viewer**, to a user, group, service principal or managed identity. For more information about assigning a role, go to [Grant access](../role-based-access-control/quickstart-assign-role-user-portal.md#grant-access).

## Related content

* [Configure Grafana teams](how-to-sync-teams-with-azure-ad-groups.md)
* [Set up authentication and permissions](how-to-authentication-permissions.md)
