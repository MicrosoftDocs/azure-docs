---
title: include file
description: include file
author: terencefan
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 08/28/2026
ms.author: tefa
ms.custom: include file
---

This section shows how to assign an Azure role to a service principal or managed identity for a Web PubSub resource.
For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

> [!NOTE]
> A role can be assigned to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Web PubSub resource.

1. Select **Access control (IAM)** in the sidebar.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select a Web PubSub built-in role or custom role that includes the permissions required by your application.

   | Role | Description | Use case |
   | --- | --- | --- |
   | [Web PubSub Service Owner](/azure/role-based-access-control/built-in-roles#web-pubsub-service-owner) | Full access to data-plane APIs, including read/write REST APIs and Auth APIs. | Most commonly used for building an upstream server that handles negotiation requests and client events. |
   | [Web PubSub Service Reader](/azure/role-based-access-control/built-in-roles#web-pubsub-service-reader) | Read-only access to data-plane APIs. | Use it when writing a monitoring tool that calls read-only REST APIs. |

   > [!TIP]
   > Follow the principle of least privilege by using a [custom role](/azure/role-based-access-control/custom-roles) with only the required [Web PubSub data-plane permissions](/azure/role-based-access-control/permissions/web-and-mobile#microsoftsignalrservice). To generate a client access token and use it to connect, the identity requires both `Microsoft.SignalRService/WebPubSub/clientConnection/generateToken/action` and `Microsoft.SignalRService/WebPubSub/clientConnection/write`. No narrower built-in role includes both permissions.

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

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
- [Assign Azure roles using the REST API](../../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles using the Azure CLI](../../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md)