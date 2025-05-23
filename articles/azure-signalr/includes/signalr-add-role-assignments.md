---
title: Include file
description: Include file
author: terencefan
ms.service: azure-signalr-service
ms.topic: Include
ms.date: 03/12/2025
ms.author: tefa
ms.custom: Include file
---

The following steps describe how to assign a SignalR App Server role to a service principal or a managed identity for an Azure SignalR Service resource. For detailed steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

> [!NOTE]
> You can assign a role to any scope, including management group, subscription, resource group, or single resource. To learn more about scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Azure SignalR Service resource.

1. On the left pane, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows the page for access control and selections for adding a role assignment.":::

1. On the **Role** tab, select **SignalR App Server**. Other Azure SignalR Service built-in roles depend on your scenario.

   | Role                                                                                              | Description                                                                                               | Use case                                                                                                                                     |
   | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
   | [SignalR App Server](../../role-based-access-control/built-in-roles.md#signalr-app-server)           | Access to the APIs that create server connections and generate keys.                                                | Most commonly used for an app server with an Azure SignalR resource running in Default mode.                                                                                                             |
   | [SignalR Service Owner](../../role-based-access-control/built-in-roles.md#signalr-service-owner)     | Full access to all data-plane APIs, including REST APIs, the APIs that create server connections, and the APIs that generate keys/tokens. | Used for a negotiation server with an Azure SignalR Service resource running in Serverless mode. It requires both REST API permissions and authentication API permissions. |
   | [SignalR REST API Owner](../../role-based-access-control/built-in-roles.md#signalr-rest-api-owner)   | Full access to data-plane REST APIs.                                                                      | Used for the [Azure SignalR Management SDK](/azure/azure-signalr/signalr-howto-use-management-sdk) to manage connections and groups, but it *doesn't* make server connections or handle negotiation requests.                          |
   | [SignalR REST API Reader](../../role-based-access-control/built-in-roles.md#signalr-rest-api-reader) | Read-only access to data-plane REST APIs.                                                                 | Used when you write a monitoring tool that calls read-only REST APIs.                                      |

1. Select **Next**.

1. For Microsoft Entra application:

   1. In the **Assign access to** row, select **User, group, or service principal**.
   1. In the **Members** row, choose **select members**, and then choose the identity in the pop-up window.

1. For managed identity for Azure resources:

   1. In the **Assign access to** row, select **Managed identity**.
   1. In the **Members** row, choose **select members**, and then choose the application in the pop-up window.

1. Select **Next**.

1. Review your assignment, and then select **Review + assign** to confirm the role assignment.

> [!IMPORTANT]
> Newly added role assignments might take up to 30 minutes to propagate.

To learn more about how to assign and manage Azure roles, see:

- [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.yml)
- [Assign Azure roles by using the REST API](../../role-based-access-control/role-assignments-rest.md)
- [Assign Azure roles by using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md)
- [Assign Azure roles by using the Azure CLI](../../role-based-access-control/role-assignments-cli.md)
- [Assign Azure roles by using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md)