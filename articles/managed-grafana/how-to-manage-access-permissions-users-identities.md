---
title: Manage access and permissions for users and identities
titleSuffix: Azure Managed Grafana
description: Learn how you can manage access permissions to Azure Managed Grafana by assigning a Grafana role to a user, group, service principal, or a managed identity.
#customer intent: As a Grafana administrator, I want to learn how to assign team members and identities relevant Grafana roles and leverage folder and dashboard permission settings, so that I can control and restrict access to Grafana.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.custom: engagement-fy23
ms.topic: how-to 
ms.date: 01/15/2025
---

# Manage access and permissions for users and identities

In today's collaborative work environments, multiple teams often need to access and manage the same monitoring dashboards. Whether it's a DevOps team monitoring application performance or a support team troubleshooting customer issues, having the right access permissions is crucial. Azure Managed Grafana simplifies this process by allowing you to set varying levels of permissions for your team members and identities.

This guide walks you through the supported Grafana roles and shows you how to use roles and permission settings to share the relevant access permissions with your team members and identities.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./how-to-permissions.md).
- You must have Grafana Admin permissions on the workspace.

## Learn about Grafana roles

Azure Managed Grafana supports [Azure role-based access control (RBAC)](../role-based-access-control/index.yml), an authorization system that lets you manage individual access to your Azure resources. 

Azure RBAC enables you to allocate varying permission levels to users, groups, service principals, or managed identities, for managing your Azure Managed Grafana resources.

The following built-in roles are available in Azure Managed Grafana, each providing different levels of access:

> [!div class="mx-tableFixed"]
> | Built-in role | Description | ID |
> | --- | --- | --- |
> | <a name='grafana-admin'></a>[Grafana Admin](../role-based-access-control/built-in-roles/monitor.md#grafana-admin) | Perform all Grafana operations, including the ability to manage data sources, create dashboards, and manage role assignments within Grafana. | 22926164-76b3-42b3-bc55-97df8dab3e41 |
> | <a name='grafana-editor'></a>[Grafana Editor](../role-based-access-control/built-in-roles/monitor.md#grafana-editor) | View and edit a Grafana instance, including its dashboards and alerts. | a79a5197-3a5c-4973-a920-486035ffd60f |
> | <a name='grafana-limited-viewer'></a>[Grafana Limited Viewer](../role-based-access-control/built-in-roles/monitor.md#grafana-limited-viewer) | View a Grafana home page. This role contains no permissions assigned by default and it is not available for Grafana v9 workspaces. | 41e04612-9dac-4699-a02b-c82ff2cc3fb5 |
> | <a name='grafana-viewer'></a>[Grafana Viewer](../role-based-access-control/built-in-roles/monitor.md#grafana-viewer) | View a Grafana workspace, including its dashboards and alerts. | 60921a7e-fef1-4a43-9b16-a26c52ad4769 |

To access the Grafana user interface, users must possess one of the roles above. You can find more information about the Grafana roles from the [Grafana documentation](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles). The Grafana Limited Viewer role in Azure maps to the "No Basic Role" in the Grafana docs.

## Assign a Grafana role

Grafana user roles and assignments are fully [integrated within Microsoft Entra ID](../role-based-access-control/built-in-roles.md#grafana-admin). You can assign a Grafana role to any Microsoft Entra user, group, service principal, or managed identity, and grant them access permissions associated with that role. You can manage these permissions from the Azure portal or the command line. This section explains how to assign Grafana roles to users in the Azure portal.

### [Portal](#tab/azure-portal)

1. Open your Azure Managed Grafana workspace.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add role assignment**.

      :::image type="content" source="media/share/iam-page.png" alt-text="Screenshot of Add role assignment in the Azure platform.":::

1. Select a Grafana role to assign among **Grafana Admin**, **Grafana Editor**, **Grafana Limited Viewer**, or **Grafana Viewer**, then select **Next**.

    :::image type="content" source="media/share/role-assignment.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

1. Choose if you want to assign access to a **User, group, or service principal**, or to a **Managed identity**.
1. Click on **Select members**, pick the members you want to assign to the Grafana role and then confirm with **Select**.
1. Select **Next**, then **Review + assign** to complete the role assignment.

### [Azure CLI](#tab/azure-cli)

Assign a role using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

In the code below, replace the following placeholders:

- `<assignee>`:
  - For a Microsoft Entra user, enter their email address or the user object ID.
  - For a group, enter the group object ID.
  - For a service principal, enter the service principal object ID.
  - For a managed identity, enter the object ID.
- `<roleNameOrId>`:
  - For Grafana Admin, enter `Grafana Admin` or `22926164-76b3-42b3-bc55-97df8dab3e41`.
   - For Grafana Editor, enter `Grafana Editor` or `a79a5197-3a5c-4973-a920-486035ffd60f`.
   - For Grafana Limited Viewer, enter `Grafana Limited Viewer` or `41e04612-9dac-4699-a02b-c82ff2cc3fb5`.
   - For Grafana Viewer, enter `Grafana Viewer` or `60921a7e-fef1-4a43-9b16-a26c52ad4769`.
- `<scope>`: enter the full ID of the Azure Managed Grafana instance.

```azurecli
az role assignment create --assignee "<assignee>" \
--role "<roleNameOrId>" \
--scope "<scope>"
```

Example:

```azurecli
az role assignment create --assignee "name@contoso.com" \
--role "Grafana Admin" \
--scope "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/my-rg/providers/Microsoft.Dashboard/grafana/my-grafana"
```
For more information about assigning Azure roles using the Azure CLI, refer to the [Role based access control documentation](../role-based-access-control/role-assignments-cli.md).

---

> [!TIP] 
> When onboarding a new user to your Azure Managed Grafana workspace, granting them the Grafana Limited Viewer role allows them limited access to the Grafana workspace.
> 
> You can then grant the user access to each relevant dashboard and data source using their management settings. This method ensures that users with the Grafana Limited Viewer role only access the specific components they need, enhancing security and data privacy.

## Edit permissions for specific component elements

Edit permissions for specific components such as dashboards, folders, and data sources from the Grafana user interface following these steps:

1. Open the Grafana portal and navigate to the component for which you want to manage permissions.
1. Go to **Settings** > **Permissions** > **Add a permission**.
1. Under **Add permission for**, select a user, service account, team, or role, and assign them the desired permission level: view, edit, or admin.

## Related content

- [Share a Grafana dashboard or panel](./how-to-share-dashboard.md). 
- [Configure data sources](./how-to-data-source-plugins-managed-identity.md)
- [Configure Grafana teams](how-to-sync-teams-with-entra-groups.md)
