---
title: Set up a workspace in Azure API Management
description: Learn how to create a workspace in Azure API Management. Workspaces allow decentralized API development teams to own and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 02/15/2023
ms.custom:\
---

# Set up a workspace

Set up a [workspace](workspaces-overview.md) (preview) to enable a decentralized API development team to manage and productize their own APIs, while a central API platform team maintains the API Management infrastructure. After you create a workspace, workspace members can create and manage their own APIs, products, subscriptions, and related resources.

[!INCLUDE [api-management-availability-premium-dev-standard](../../includes/api-management-availability-premium-dev-standard.md)]

> [!NOTE]
> Workspaces are supported in API Management REST API version 2022-09-01-preview or later.

## Prerequisites

* An API Management instance. If you need to, [create one](get-started-create-service-instance.md).

## Create a workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Workspaces** (preview) > **+ Add**.
:::image type="content" source="media/how-to-create-workspace/create-workspace-portal.png" alt-text="Screenshot of creating an API Management workspace in the portal.":::
    
1. In the **Create workspace** window, enter a descriptive **Name**, resource **Id**, and optional **Description** for the workspace. Select **Save**

The new workspace appears in the list on the **Workspaces** page. Select the workspace to manage its settings and resources.


## Assign administrator to workspace - portal

After creating a workspace, assign an administrator who can add other workspace collaborators to manage the workspace's resources.

1. In the portal, select the workspace that you created.
1. In the **Workspace** window, select **Access control (IAM)**> **+ Add**.
    :::image type="content" source="media/how-to-create-workspace/workspace-access-control.png" alt-text="Screenshot of configuring access control to a workspace in the portal.":::
1. Assign a user the following roles to serve as the workspace administrator:

    * **API Management Workspace Owner** (workspace level)
    * **API Management Service Workspace API Product Manager** (service level)

    For steps to assign a role, see [Assign Azure roles using the portal](../role-based-access-control/role-assignments-portal.md?tabs=current).
1. Optionally, assign roles to other workspace users to manage workspace APIs and other resources. For a list of roles, see [Use role-based access-control](api-management-role-based-access-control.md). Each user must be assigned both a workspace-level role and a service-level role.


## Migrate service-level resources to a workspace

[Point to migration tool on GH?]

## Next steps

* Workspace collaborators can get started [managing APIs and other resources in their API Management workspace](api-management-in-workspace.md)

