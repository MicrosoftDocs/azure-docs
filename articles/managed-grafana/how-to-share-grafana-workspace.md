---
title: How to share an Azure Managed Grafana instance
description: 'Learn how you can share access permissions to Azure Grafana Managed.' 
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.custom: engagement-fy23
ms.topic: how-to 
ms.date: 3/08/2023 
---

# How to share access to Azure Managed Grafana

A DevOps team may build dashboards to monitor and diagnose an application or infrastructure that it manages. Likewise, a support team may use a Grafana monitoring solution for troubleshooting customer issues. In these scenarios, multiple users are accessing one Grafana instance. 

Azure Managed Grafana enables such collaboration by allowing you to set custom permissions on an instance that you own. This article explains what permissions are supported and how to grant permissions to share an Azure Managed Grafana instance with your stakeholders.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a Managed Grafana instance](./how-to-permissions.md).
- You must have Grafana Admin permissions on the instance.

## Supported Grafana roles

Azure Managed Grafana supports the Grafana Admin, Grafana Editor, and Grafana Viewer roles:

- The Grafana Admin role provides full control of the instance including managing role assignments, viewing, editing, and configuring data sources.
- The Grafana Editor role provides read-write access to the dashboards in the instance.
- The Grafana Viewer role provides read-only access to dashboards in the instance.

More details on Grafana roles can be found in the [Grafana documentation](https://grafana.com/docs/grafana/latest/permissions/organization_roles/#compare-roles).

Grafana user roles and assignments are fully [integrated within Microsoft Entra ID](../role-based-access-control/built-in-roles.md#grafana-admin). You can assign a Grafana role to any Microsoft Entra user, group, service principal or managed identity, and grant them access permissions associated with that role. You can manage these permissions from the Azure portal or the command line. This section explains how to assign Grafana roles to users in the Azure portal.

> [!NOTE]
> Azure Managed Grafana doesn't support personal Microsoft accounts (MSA) currently.

## Add a Grafana role assignment

### [Portal](#tab/azure-portal)

1. Open your Azure Managed Grafana instance.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add role assignment**.

      :::image type="content" source="media/share/iam-page.png" alt-text="Screenshot of Add role assignment in the Azure platform.":::

1. Select a Grafana role to assign among **Grafana Admin**, **Grafana Editor** or **Grafana Viewer**, then select **Next**.

    :::image type="content" source="media/share/role-assignment.png" alt-text="Screenshot of the Grafana roles in the Azure platform.":::

1. Choose if you want to assign access to a **User, group, or service principal**, or to a **Managed identity**.
1. Click on **Select members**, pick the members you want to assign to the Grafana role and then confirm with **Select**.
1. Select **Next**, then **Review + assign** to complete the role assignment.

> [!NOTE]
> Dashboard and data source level sharing are done from within the Grafana application. For more information, refer to [Share a Grafana dashboard or panel](./how-to-share-dashboard.md). [Share a Grafana dashboard] and [Data source permissions](https://grafana.com/docs/grafana/latest/administration/data-source-management/#data-source-permissions).

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
--scope "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/my-rg/providers/Microsoft.Dashboard/grafana/my-grafana"
```
For more information about assigning Azure roles using the Azure CLI, refer to the [Role based access control documentation](../role-based-access-control/role-assignments-cli.md).

---

## Next steps

> [!div class="nextstepaction"]
> [Configure data sources](./how-to-data-source-plugins-managed-identity.md)

> [!div class="nextstepaction"]
> [Modify access permissions to Azure Monitor](./how-to-permissions.md)

> [!div class="nextstepaction"]
> [Share a Grafana dashboard or panel](./how-to-share-dashboard.md). 
