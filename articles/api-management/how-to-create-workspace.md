---
title: Set up a workspace in Azure API Management
description: Learn how to create a workspace in Azure API Management. Workspaces allow decentralized API development teams to own and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 03/07/2023
ms.custom:
---

# Set up a workspace

Set up a [workspace](workspaces-overview.md) (preview) to enable a decentralized API development team to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. After you create a workspace and assign permissions, workspace collaborators can create and manage their own APIs, products, subscriptions, and related resources.

[!INCLUDE [api-management-availability-premium-dev-standard](../../includes/api-management-availability-premium-dev-standard.md)]

> [!NOTE]
> * Workspaces are a preview feature of API Management and subject to certain [limitations](workspaces-overview.md#preview-limitations).
> * Workspaces are supported in API Management REST API version 2022-09-01-preview or later.
> * For pricing considerations, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md).

## Create a workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Workspaces** (preview) > **+ Add**.
:::image type="content" source="media/how-to-create-workspace/create-workspace-portal.png" alt-text="Screenshot of creating an API Management workspace in the portal." lightbox="media/how-to-create-workspace/create-workspace-portal-enlarged.png":::
    
1. In the **Create workspace** window, enter a descriptive **Name**, resource **Id**, and optional **Description** for the workspace. Select **Save**.

The new workspace appears in the list on the **Workspaces** page. Select the workspace to manage its settings and resources.


## Assign users to workspace - portal

After creating a workspace, assign permissions to users to manage the workspace's resources. Each workspace user must be assigned both a service-scoped workspace RBAC role and a workspace-scoped RBAC role, or granted equivalent permissions using custom roles. 

> [!NOTE]
> For easier management, set up Microsoft Entra groups to assign workspace permissions to multiple users.
> 

* For a list of built-in workspace roles, see [How to use role-based access control in API Management](api-management-role-based-access-control.md).
* For steps to assign a role, see [Assign Azure roles using the portal](../role-based-access-control/role-assignments-portal.md?tabs=current).


### Assign a service-scoped role

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Access control (IAM)** > **+ Add**.

1. Assign one of the following service-scoped roles to each member of the workspace:

    * **API Management Service Workspace API Developer**
    * **API Management Service Workspace API Product Manager**

### Assign a workspace-scoped role

1. In the menu for your API Management instance, select **Workspaces (preview)**  > the name of the workspace that you created.
1. In the **Workspace** window, select **Access control (IAM)**> **+ Add**.
    
1. Assign one of the following workspace-scoped roles to the workspace members to manage workspace APIs and other resources. 

    * **API Management Workspace Reader**
    * **API Management Workspace Contributor**
    * **API Management Workspace API Developer**
    * **API Management Workspace API Product Manager**

## Migrate resources to a workspace

The open source [Azure API Management workspaces migration tool](https://github.com/Azure-Samples/api-management-workspaces-migration) can help you with the initial setup of resources in the workspace. Use the tool to migrate selected service-level APIs with their dependencies from an Azure API Management instance to a workspace.  

## Next steps

* Workspace collaborators can get started [managing APIs and other resources in their API Management workspace](api-management-in-workspace.md)
