---
title: Grant users and identities access to Azure Managed Grafana
titleSuffix: Azure Managed Grafana
description: Learn how to grant a user, group, service principal, or managed identity access to Azure Managed Grafana and its dashboards.
#customer intent: As a Grafana administrator, I want to learn how to assign team members and identities relevant Grafana roles and leverage folder and dashboard permission settings, so that I can control and restrict access to Grafana.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.custom: engagement-fy23
ms.topic: how-to 
ms.date: 09/22/2026
---

# Grant users and identities access to Azure Managed Grafana

Multiple teams often need access to the same monitoring dashboards. For example, a DevOps team might monitor application performance while a support team uses the same dashboards to troubleshoot customer issues.

Use Azure role-based access control (RBAC) to grant Microsoft Entra users, groups, service principals, or managed identities access to an Azure Managed Grafana workspace. The assigned Grafana role determines what the recipient can do in Grafana. Grafana Admins can then use Grafana permissions to refine access to specific folders, dashboards, and data sources.

This article explains the supported Grafana roles, how to assign them, and how to configure permissions for Grafana components.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If you don't have one yet, you can [create one in the Azure portal](./quickstart-managed-grafana-portal.md) or [create one using the Azure CLI](./quickstart-managed-grafana-cli.md).
- To assign a Grafana role, permission to create role assignments on the workspace, such as [Role Based Access Control Administrator](../role-based-access-control/built-in-roles/privileged.md#role-based-access-control-administrator), [User Access Administrator](../role-based-access-control/built-in-roles/privileged.md#user-access-administrator), or [Owner](../role-based-access-control/built-in-roles/privileged.md#owner).
- To edit folder, dashboard, or data source permissions in Grafana, the **Grafana Admin** role.

## Learn about Grafana roles

Azure Managed Grafana supports [Azure RBAC](../role-based-access-control/index.yml), an authorization system that lets you grant different levels of workspace access to users, groups, service principals, or managed identities.

The following built-in roles are available in Azure Managed Grafana, each providing different levels of access:

> [!div class="mx-tableFixed"]
> | Built-in role | Description | ID |
> | --- | --- | --- |
> | <a name='grafana-admin'></a>[Grafana Admin](../role-based-access-control/built-in-roles/monitor.md#grafana-admin) | Perform all Grafana operations, including managing data sources, creating dashboards, and administering Grafana teams and component permissions. | 22926164-76b3-42b3-bc55-97df8dab3e41 |
> | <a name='grafana-editor'></a>[Grafana Editor](../role-based-access-control/built-in-roles/monitor.md#grafana-editor) | View and edit a Grafana instance, including its dashboards and alerts. | a79a5197-3a5c-4973-a920-486035ffd60f |
> | <a name='grafana-limited-viewer'></a>[Grafana Limited Viewer](../role-based-access-control/built-in-roles/monitor.md#grafana-limited-viewer) | View a Grafana home page. This role contains no permissions assigned by default and it is not available for Grafana v9 workspaces. | 41e04612-9dac-4699-a02b-c82ff2cc3fb5 |
> | <a name='grafana-viewer'></a>[Grafana Viewer](../role-based-access-control/built-in-roles/monitor.md#grafana-viewer) | View a Grafana workspace, including its dashboards and alerts. | 60921a7e-fef1-4a43-9b16-a26c52ad4769 |

To access the Grafana user interface, users must possess one of the roles listed in the previous table. You can find more information about the Grafana roles from the [Grafana documentation](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles). The Grafana Limited Viewer role in Azure maps to the "No Basic Role" in the Grafana docs.

## Assign a Grafana role

Grafana [user roles](../role-based-access-control/built-in-roles/monitor.md#grafana-admin) and assignments fully integrate with Microsoft Entra ID. You can assign a Grafana role to any Microsoft Entra user, group, service principal, or managed identity, and grant them the access permissions associated with that role. You can manage these permissions from the Azure portal or the command line. This section explains how to assign Grafana roles to users in the Azure portal.

### [Portal](#tab/azure-portal)

1. Open your Azure Managed Grafana workspace.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add role assignment**.

   :::image type="content" source="media/share/iam-page.png" alt-text="Screenshot of Add role assignment in the Azure platform.":::

1. Select a Grafana role to assign among **Grafana Admin**, **Grafana Editor**, **Grafana Limited Viewer**, or **Grafana Viewer**, then select **Next**.

   :::image type="content" source="media/share/role-assignment.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

1. Choose if you want to assign access to a **User, group, or service principal**, or to a **Managed identity**.
1. Choose **Select members** and pick the members you want to assign to the Grafana role. Confirm your choices with **Select**.
1. Select **Next**, then **Review + assign** to complete the role assignment.

### [Azure CLI](#tab/azure-cli)

Assign a role using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

In the following code, replace these placeholders:

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
For more information about assigning Azure roles using the Azure CLI, see [Role based access control documentation](../role-based-access-control/role-assignments-cli.md).

---

> [!TIP] 
> When you onboard a new user to your Azure Managed Grafana workspace, granting them the Grafana Limited Viewer role allows them limited access to the Grafana workspace.
> 
> You can then grant the user access to each relevant dashboard and data source using their management settings. This method ensures that users with the Grafana Limited Viewer role only access the specific components they need, enhancing security and data privacy.

## Edit permissions for specific component elements

Edit permissions for specific components such as dashboards, folders, and data sources from the Grafana user interface following these steps:

1. Open the Grafana portal and navigate to the component for which you want to manage permissions.
1. Go to **Settings** > **Permissions** > **Add a permission**.
1. Under **Add permission for**, select a user, service account, team, or role, and assign them the desired permission level: view, edit, or admin.

Grafana uses the highest permission a person gets from their Grafana role, an individual assignment, a team, or a parent folder. Assigning a lower permission on a component doesn't override a higher permission inherited from another source. You also can't restrict the access of a Grafana Admin by using component permissions.

For a scalable approach to component access, [synchronize Grafana teams with Microsoft Entra groups](./how-to-sync-teams-with-entra-groups.md).

## Related content

- [Share a Grafana dashboard or panel](./how-to-share-dashboard.md)
- [Configure data sources](./how-to-data-source-plugins-managed-identity.md)
- [Configure Grafana teams](./how-to-sync-teams-with-entra-groups.md)
