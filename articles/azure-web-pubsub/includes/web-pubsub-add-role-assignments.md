---
title: include file
description: include file
author: terencefan
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 03/12/2025
ms.author: tefa
ms.custom: include file
---

This section shows how to assign a `Web PubSub Service Owner` role to a service principal or managed identity for a Web PubSub resource.
For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

> [!NOTE]
> A role can be assigned to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Web PubSub resource.

1. Select **Access control (IAM)** in the sidebar.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select **Web PubSub Service Owner** or other Web PubSub built-in roles depends on your scenario.

   | Role                                                                                              | Description                                                                                               | Use case                                                                                                                                     |
   | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
   | [Web PubSub Service Owner](/azure/role-based-access-control/built-in-roles#web-pubsub-service-owner)           | Full access to data-plane APIs, including read/write REST APIs and Auth APIs.                                               | Most commonly used for building a upstream server that handles negotiation requests and client events.                                                                                                             |
   | [Web PubSub Service Reader](/azure/role-based-access-control/built-in-roles#web-pubsub-service-reader)           | Readonly access to data-plane APIs.                                                | Use it when write a monitoring tool that calls readonly REST APIs.

1. Select Next.

1. For Microsoft Entra application.

   1. In the `Assign access` to row, select **User, group, or service principal**.
   1. In the `Members` row, click `select members`, then choose the identity in the pop-up window.

1. For managed identity for Azure resources.

   1. In the `Assign access` to row, select **Managed identity**.
   1. In the `Members` row, click `select members`, then choose the application in the pop-up window.

1. Select Next.

1. Review your assignment, then click **Review + assign** to confirm the role assignment.

> [!IMPORTANT]
> Newly added role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure roles, see these articles:

- [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml)
- [Assign Azure roles using the REST API](../../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles using the Azure CLI](../../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md)