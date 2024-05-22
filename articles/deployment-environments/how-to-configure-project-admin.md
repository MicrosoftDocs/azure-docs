---
title: Provide administrative access to Azure Deployment Environments projects
titleSuffix: Azure Deployment Environments
description: Learn how to configure administrative access for dev team leads by using the DevCenter Project Admin built-in role.
ms.service: deployment-environments
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/04/2023
ms.topic: how-to
---

# Provide access to projects for dev team leads

This guide explains how to assign permissions to dev team leads for a project in Azure Deployment Environments.

You can create multiple projects associated with the dev center to align with each team's requirements. By using the built-in DevCenter Project Admin role, you can delegate project administration to a member of a team. DevCenter Project Admin users can configure [project environment types](concept-environments-key-concepts.md#project-environment-types) to enable developers to create various types of [environments](concept-environments-key-concepts.md#environments) and apply settings to each environment type.

You can assign the DevCenter Project Admin role to a dev team lead at either the project level or the environment type level. Based on the scope of access that you allow, a DevCenter Project Admin user can:

* View, add, update, disable, or delete the project environment types.
* Create an environment.
* Read, write, delete, or perform actions (like deploy or reset) on their own environment.
* Read, delete, or perform actions (like deploy or reset) on environments that other users created.

When you assign the role at the project level, the user can perform the preceding actions on all environment types at the project level. When you assign the role to specific environment types, the user can perform the actions only on the respective environment types.

## Assign permissions to dev team leads for a project

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. Select **Projects**, then choose the project that you want your development team members to be able to access.
1. Select **Access control (IAM)** from the left menu.
1. Select **Add** > **Add role assignment**.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Project Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have administrative access to the project. |

    :::image type="content" source="media/configure-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the Add role assignment pane." lightbox="media/configure-project-admin/add-role-assignment-admin.png":::

The users can now view the project and manage all the environment types that you've enabled within it. DevCenter Project Admin users can also [create environments from the Azure CLI](how-to-create-access-environments.md).

## Assign permissions to dev team leads for an environment type

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. Select **Projects**, then choose the project that you want your development team members to be able to access.
1. Select **Environment types**, and then select the ellipsis (**...**) beside the specific environment type.

   :::image type="content" source="media\configure-project-admin\project-environment-types.png" alt-text="Screenshot that shows the environment types associated with a project." lightbox="media\configure-project-admin\project-environment-types.png":::

1. Select **Access control (IAM)** from the menu.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Project Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have administrative access to the environment type. |

    :::image type="content" source="media/configure-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the Add role assignment pane." lightbox="media/configure-project-admin/add-role-assignment-admin.png":::

The users can now view the project and manage only the specific environment type that you've granted them access to. DevCenter Project Admin users can also [create environments by using the Azure CLI](how-to-create-access-environments.md).

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

## Related content

* [Provide access for developers to projects](./how-to-configure-deployment-environments-user.md)
