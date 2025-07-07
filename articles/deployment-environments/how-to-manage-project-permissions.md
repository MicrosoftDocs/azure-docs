---
title: 
titleSuffix: Azure Deployment Environments
description: Learn how to configure administrative access for dev team leads by using the built-in DevCenter Project Admin role.
ms.service: azure-deployment-environments
ms.custom: peer-review
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/30/2025
ms.topic: how-to

#customer intent: As a platform engineer, I want to assign permissions to developers and dev team leads so that they can peform the appropriate actions.
---

# Provide access to projects

In Azure Deployment Environments, resources are organized into projects to meet the requirements of development teams. A dev center can be linked to multiple projects to match the needs of different developer teams. 

Deployment Environments provides three roles that let you give users access for different purposes: 

- **Deployment Environments User:** Lets users access a project so they can create and manage their own deployment environments.
- **DevCenter Project Admin:** Lets users manage the project and its resources.
- **Deployment Environments Reader:** Lets users view other users' deployment environments



## Prerequisites 

- To assign permissions to a project, you must have the **Owner** or **User Access Administrator** role on the project, resource group, or subscription.





## Assign permissions

Deployment Environments 

| Role | Assignment Scope | Permissions |
|------|------------------|-------------|
| DevCenter Project Admin | Project level | View, add, update, disable, or delete project environment types; create environments; read, write to, delete, or perform actions (like deploy or reset) on their own environments; read, delete, or perform actions (like deploy or reset) on environments that other users created |
| DevCenter Project Admin | Environment-type level | Perform the same actions as project level, but only on those environment types |
| Deployment Environments User | Project level | View the project environment types; create an environment; read, write to, delete, or perform actions (like deploy or reset) on their own environment |
| Deployment Environments User | Environment-type level | Perform the same actions as project level, but only on the respective environment types |
| Deployment Environments Reader | Any level | Read environments that other users created |

[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

## Assign permissions to dev team leads for a project

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Projects**, and then select the project that you want your development team members to be able to access.
1. Select **Access control (IAM)** in the left menu.
1. Select **Add** > **Add role assignment**.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Project Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups you want to have administrative access to the project. |

    :::image type="content" source="media/configure-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the Add role assignment pane." lightbox="media/configure-project-admin/add-role-assignment-admin.png":::

The users can now view the project and manage all the environment types that you've enabled in it. DevCenter Project Admin users can also [create environments from the Azure CLI](how-to-create-access-environments.md).

## Assign permissions to dev team leads for an environment type

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Projects**, and then select the project that you want your development team members to be able to access.
1. In the left menu, select **Environment types**. 
1. Select the ellipsis (**...**) next to the appropriate environment type, and then select **Access control**:

   :::image type="content" source="media\configure-project-admin\project-environment-types.png" alt-text="Screenshot that shows the environment types associated with a project." lightbox="media\configure-project-admin\project-environment-types.png":::

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Project Admin**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups that you want to have administrative access to the environment type. |

    :::image type="content" source="media/configure-project-admin/add-role-assignment-admin.png" alt-text="Screenshot that shows the Add role assignment pane." lightbox="media/configure-project-admin/add-role-assignment-admin.png":::

The users can now view the project and manage only the specific environment type that you've granted them access to. DevCenter Project Admin users can also [create environments by using the Azure CLI](how-to-create-access-environments.md).






## Related resources

- [Azure role-based access control in Azure Deployment Environments](concept-deployment-environments-role-based-access-control.md)