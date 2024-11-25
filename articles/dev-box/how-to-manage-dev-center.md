---
title: Manage a Microsoft Dev Box dev center
titleSuffix: Microsoft Dev Box
description: Microsoft Dev Box dev centers help you manage dev box resources, grouping projects with similar settings. Learn how to create, delete, and manage dev centers.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/14/2024
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage dev centers so that I can manage my Microsoft Dev Box implementation.
---

# Manage a Microsoft Dev Box dev center

In this article, you learn how to manage a dev center in Microsoft Dev Box by using the Azure portal.

Development teams vary in the way they function and can have different needs. A dev center helps you manage these scenarios by enabling you to group similar sets of projects together and apply similar settings.

## Permissions

To manage a dev center, you need the following permissions:

| Action | Permissions required |
|---|---|
| _Create or delete a dev center_ | Owner or Contributor permissions on an Azure subscription or a specific resource group. |
| _Manage a dev center_ | Owner or Contributor role, or specific Write permission to the dev center. |
| _Attach or remove a network connection_ | Network Contributor permissions on an existing network connection (Owner or Contributor). |

## Create a dev center

Your development teams' requirements change over time. You can create a new dev center in Microsoft Dev Box to support organizational changes like a new business requirement or a new regional center.

You can create as many or as few dev centers as you need, depending on how you organize and manage your development teams.

To create a dev center in the Azure portal: 

[!INCLUDE [create-dev-center-steps](includes/create-dev-center-steps.md)]

## Delete a dev center

You might choose to delete a dev center to reflect organizational or workload changes. Deleting a dev center in Microsoft Dev Box is irreversible, and you must prepare for the deletion carefully.

A dev center can't be deleted while any projects are associated with it. You must delete the projects before you can delete the dev center.

Attached network connections and their associated virtual networks aren't deleted when you delete a dev center.

When you're ready to delete your dev center, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the search results, select **Dev centers** from the **Services** list.

1. On the **Dev centers** page, open the dev center that you want to delete.

1. Select **Delete**.

   :::image type="content" source="./media/how-to-manage-dev-center/delete-dev-center.png" alt-text="Screenshot of the Delete button on the page for a dev center." lightbox="./media/how-to-manage-dev-center/delete-dev-center.png":::

1. In the confirmation message, select **OK**.

[!INCLUDE [attach or remove a network connection](./includes/attach-remove-network-connections.md)]

## Assign permissions for users

You can assign multiple users permissions to a dev center to help with administrative tasks. You can assign users or groups to the following built-in roles:

- **Owner**: Grants full access to manage all resources, including the ability to assign roles in Azure role-based access control (RBAC).
- **Contributor**: Grants full access to manage all resources, but doesn't allow the user to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
- **Reader**: Grants the ability to view all resources, but doesn't allow the user to make any changes.

To make role assignments:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you want to give access to.

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign a role by configuring the following settings. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    |---|---|
    | **Role** | Select **Owner**, **Contributor**, or **Reader**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups that you want to be able to access the dev center. |

## Related content

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create a dev box definition](quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)
