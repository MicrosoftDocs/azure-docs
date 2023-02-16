---
title: Manage APIs in workspace in Azure API Management
description: Learn how an API development team can use a workspace in Azure API Management to own and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 02/15/2023
ms.custom: ignite-fall-2021
---

# Manage APIs and other resources in your API Management workspace

This article is an introduction to managing APIs, products, subscriptions, and other API Management resources in a *workspace*. A workspace is a place where a development team can own, manage, update, and productize their own APIs, while a central API platform team manages the API Management infrastructure. Learn about the [workspace features](workspaces-overview.md).



[!INCLUDE [api-management-availability-premium-dev-standard](../../includes/api-management-availability-premium-dev-standard.md)]

> [!NOTE]
> Workspaces are supported in API Management REST API version 2022-09-01-preview or later.

## Prerequisites

* An API Management instance. If needed, ask an administrator to [create one](get-started-create-service-instance.md).
* A workspace. If needed, ask an administrator of your API Management instance to [create one](how-to-create-workspace.md).
* Permissions to collaborate in the workspace. If needed, ask a workspace administrator to assign you appropriate [roles](api-management-role-based-access-control.md#built-in-workspace-roles) in the workspace.

## Go to the workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Workspaces** (preview), and select the name of your workspace.

    :::image type="content" source="media/api-management-in-workspace/workspace-in portal.png" alt-text="Screenshot of workspaces in API Management instance in the portal.":::
    
1. The workspace appears. The resources and settings you can manage appear in the menu on the left.

    :::image type="content" source="media/api-management-in-workspace/workspace-menu.png" alt-text="Screenshot of API Management workspace menu in the portal.":::


## Get started with your workspace

Depending on your role in the workspace, you might have permissions to create APIs, products, subscriptions, and other resources, or you might have read-only access to some or all of them.

To get started managing, protecting, and publishing APIs in your workspaces, see the following guidance.

[Add table of links to getting started guidance for the different resources]

[Add separate section for how to add members?]

## Next steps

