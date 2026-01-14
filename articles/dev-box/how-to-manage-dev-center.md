---
title: Manage a dev center
titleSuffix: Microsoft Dev Box
description: Learn how to create, delete, and manage dev centers to group Microsoft Dev Box projects with similar settings.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/20/2025
ms.topic: how-to
#Customer intent: As a platform engineer, I want to be able to manage dev centers so that I can manage my Microsoft Dev Box implementation.
---

# Manage a Microsoft Dev Box dev center

Development teams can vary in their functions and needs. A Microsoft Dev Box dev center helps you manage different scenarios by grouping and applying the same settings to similar projects.

You can create as many dev centers as you need, depending on how you organize and manage your development teams. You can delete dev centers and create new ones to support organizational changes, new business requirements, or new regional centers.

You can add users to a dev center to do administrative tasks, and you can attach network connections to dev centers. This article shows you how to use the Azure portal to create and manage a Microsoft Dev Box dev center.

>[!NOTE]
>Microsoft Dev Box uses [Microsoft-hosted networks](/windows-365/enterprise/deployment-options#microsoft-hosted-network) to host dev box pools by default. However, you can host dev boxes in your own virtual networks instead. To use your own network with Microsoft Dev Box, you must [create a network connection](how-to-configure-network-connections.md#create-a-network-connection) and then [attach the network connection to a dev center](#attach-network-connection).
 
 ## Permissions

| Category | Requirement |
|---|---|
| Permissions | - To create or delete a dev center, **Owner** or **Contributor** role in the Azure subscription or resource group.<br> - To manage a dev center, **Owner** or **Contributor** role or specific **Write** permissions to the dev center.<br> - To attach or remove a network connection, **Owner** or **Contributor** role or **Network Contributor** permissions on the network connection. |
| Connectivity | To attach or remove a network connection, an existing network connection in the same Azure subscription as the dev center.
| Authentication | To attach or remove a network connection, Microsoft Entra ID for identity and access management and Microsoft Intune for device management. |

## Create a dev center

To create a dev center in the Azure portal:

[!INCLUDE [create-dev-center-steps](includes/create-dev-center-steps.md)]

## Assign dev center permissions to users

You can assign users or groups to the following built-in Azure or Microsoft Dev Box roles.

- **Owner** grants full access to manage all resources in the dev center, including the ability to assign roles in Azure role-based access control (RBAC).
- **Contributor** grants full access to manage all resources in the dev center, but not assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
- **Reader** grants the ability to view all resources in the dev center, but not make any changes.
- **DevCenter Owner** provides access to manage all Microsoft.DevCenter resources and access to them.
- **DevCenter Project Admin** provides access to manage project resources.
- **DevCenter Dev Box User** provides access to create and manage dev boxes and can be granted to users by project admins.

To assign roles to users:

1. In the [Azure portal](https://portal.azure.com), go to the page for the dev center you want to assign users to.
1. On the dev center page, select **Access control (IAM)** in the left navigation menu.
1. On the **Access control (IAM)** page, select **Add role assignment**.
1. On the **Role** tab of the **Add role assignment** page, select one of the built-in roles, and then select the **Members** tab.
1. On the **Members** tab, select **User, group, or service principal**, and then select the **Select members** link.
1. On the **Select members** screen, search for and select users or groups you want to assign the role, and select **Select**.
1. Select **Review + assign**, and then select **Review + assign** again.

For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

<a name="attach-network-connection"></a>
[!INCLUDE [attach or remove a network connection](./includes/attach-remove-network-connections.md)]

## Delete a dev center

You can delete a Microsoft Dev Box dev center to reflect organizational or workload changes.

- Deleting a dev center is irreversible.
- You can't delete a dev center that has any projects associated with it. You must delete the projects before you can delete the dev center.
- Attached network connections and their associated virtual networks aren't deleted when you delete a dev center.

To delete a dev center:

1. In the [Azure portal](https://portal.azure.com), go to the page for the dev center you want to delete.
1. On the dev center page, select **Delete**.

   :::image type="content" source="./media/how-to-manage-dev-center/delete-dev-center.png" alt-text="Screenshot of the Delete button on the page for a dev center.":::

1. Select **OK** in the confirmation message.

## Related content

- [Manage a Microsoft Dev Box project](how-to-manage-dev-box-projects.md)
- [Provide access to projects for project admins](how-to-project-admin.md)
- [Create a dev box definition](how-to-manage-dev-box-definitions.md#create-a-dev-box-definition)
- [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)
