---
title: Grant Access to Dev Box Projects for Developers
titleSuffix: Microsoft Dev Box
description: Grant developers access to Microsoft Dev Box projects to create and manage dev boxes using Azure RBAC. Learn how to assign roles effectively.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/23/2025
ms.topic: how-to
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:03/23/2025
  - ai-gen-description

#customer intent: As a platform engineer, I want to know how to assign roles in the Azure portal so that I can grant access to specific users or groups.  
---

# Grant user-level access to projects in Microsoft Dev Box

This article explains how to grant developers access to create and manage a dev box in the Microsoft Dev Box developer portal. Microsoft Dev Box uses Azure role-based access control (Azure RBAC) to grant access to service functionality.

Team members must have access to a specific Microsoft Dev Box project before they can create dev boxes. Use the built-in DevCenter Dev Box User role to assign permissions to Active Directory users or groups. You assign the role at the project level in Microsoft Dev Box.

Grant user access to create and manage dev boxes by assigning the DevCenter Dev Box User role at the project level.

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

A DevCenter Dev Box User can:

- View pools within a project.  
- Create dev boxes.  
- Connect to a dev box.  
- Manage dev boxes they created.  
- Delete dev boxes they created.

## Assign permissions to dev box users

To grant a user access to create and manage a dev box in Microsoft Dev Box, you assign the DevCenter Dev Box User role at the project level.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give your team members access to.

   :::image type="content" source="./media/how-to-dev-box-user/projects-grid.png" alt-text="Screenshot that shows a list of existing projects." lightbox="./media/how-to-dev-box-user/projects-grid.png":::

1. On the left menu, select **Access Control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | **Role** | Select **DevCenter Dev Box User**. |
    | **Assign access to** | Select **User, group, or service principal**. |
    | **Members** | Select the users or groups that you want to have access to the project. |

    :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot that shows the pane for adding role assignments." lightbox="media/how-to-dev-box-user/add-role-assignment-user.png":::

Users can now view the project and all pools within it. Dev box users can create dev boxes from any pool and manage them from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [dev box runs on creation note](./includes/note-dev-box-runs-on-creation.md)]

## Related content

- [Quickstart: Create a dev box by using the developer portal](quickstart-create-dev-box.md)