---
title: Use a workspace in Azure API Management
description: Members of a workspace in Azure API Management can collaborate to manage and productize their own APIs.
author: dlepow
ms.topic: how-to
ms.service: api-management
ms.author: danlep
ms.date: 03/10/2023
---

# Manage APIs and other resources in your API Management workspace

This article is an introduction to managing APIs, products, subscriptions, and other API Management resources in a *workspace*. A workspace is a place where a development team can own, manage, update, and productize their own APIs, while a central API platform team manages the API Management infrastructure. Learn about the [workspace features](workspaces-overview.md)

[!INCLUDE [api-management-availability-premium](../../includes/api-management-availability-premium.md)]

> [!NOTE]
> * Workspaces are a preview feature of API Management and subject to certain [limitations](workspaces-overview.md#preview-limitations).
> * Workspaces are supported in API Management REST API version 2022-09-01-preview or later.
> * For pricing considerations, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

## Prerequisites

* An API Management instance. If needed, ask an administrator to [create one](get-started-create-service-instance.md).
* A workspace. If needed, ask an administrator of your API Management instance to [create one](how-to-create-workspace.md).
* Permissions to collaborate in the workspace. If needed, ask an administrator of your API Management instance to assign you appropriate [roles](api-management-role-based-access-control.md#built-in-workspace-roles) in the service and the workspace.

## Go to the workspace - portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.

1. In the left menu, select **Workspaces** (preview), and select the name of your workspace.

    :::image type="content" source="media/api-management-in-workspace/workspace-in-portal.png" alt-text="Screenshot of workspaces in API Management instance in the portal." lightbox="media/api-management-in-workspace/workspace-in-portal-expanded.png":::
    
1. The workspace appears. The available resources and settings appear in the menu on the left.

    :::image type="content" source="media/api-management-in-workspace/workspace-menu.png" alt-text="Screenshot of API Management workspace menu in the portal." lightbox="media/api-management-in-workspace/workspace-menu-expanded.png":::


## Get started with your workspace

Depending on your role in the workspace, you might have permissions to create APIs, products, subscriptions, and other resources, or you might have read-only access to some or all of them.

To get started managing, protecting, and publishing APIs in your workspaces, see the following guidance.



|Resource  |Guide  |
|---------|---------|
|APIs     |   [Tutorial: Import and publish your first API](import-and-publish.md)      |
|Products     |   [Tutorial: Create and publish a product](api-management-howto-add-products.md)      |
|Subscriptions     | [Subscriptions in Azure API Management](api-management-subscriptions.md)<br/><br/>[Create subscriptions in API Management](api-management-howto-create-subscriptions.md)        |
|Policies     |  [Tutorial: Transform and protect your API](transform-api.md)<br/><br/>[Policies in Azure API Management](api-management-howto-policies.md)<br/><br/>[Set or edit API Management policies](set-edit-policies.md)       |
|Named values     | [Manage secrets using named values](api-management-howto-properties.md)        |
|Policy fragments     |  [Reuse policy configurations in your API Management policy definitions](policy-fragments.md)       |
| Schemas | [Validate content](validate-content-policy.md) |
| Groups | [Create and use groups to manage developer accounts](api-management-howto-create-groups.md)
| Notifications | [How to configure notifications and notification templates](api-management-howto-configure-notifications.md)



## Next steps

* Learn more about [workspaces](workspaces-overview.md)

