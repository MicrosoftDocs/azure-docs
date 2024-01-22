---
title: Grant role-based access for users in Microsoft Azure Maps
titleSuffix: Azure Maps
description: Use role-based access control to grant users authorization to Azure Maps
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/21/2021
ms.topic: include
ms.service: azure-maps
services: azure-maps

custom.ms: subject-rbac-steps
---

## Grant role-based access for users to Azure Maps

You can grant *Azure role-based access control (Azure RBAC)* by assigning a Microsoft Entra group or security principal to one or more Azure Maps role definitions.

To view the available Azure role definitions for Azure Maps, see [View built-in Azure Maps role definitions](../how-to-manage-authentication.md#view-built-in-azure-maps-role-definitions).

For detailed steps about how to assign an available Azure Maps role to the created managed identity or the service principal, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)

To efficiently manage the Azure Maps app and resource access of a large amount of users, see [Microsoft Entra groups](../../active-directory/fundamentals/active-directory-manage-groups.md).

>[!IMPORTANT]
>For users to be allowed to authenticate to an application, the users must first be created in Microsoft Entra ID. For more information, see [Add or delete users using Microsoft Entra ID](../../active-directory/fundamentals/add-users-azure-active-directory.md).

To learn about how to effectively manage a large directory for users, see [Microsoft Entra ID](../../active-directory/fundamentals/index.yml).

> [!WARNING]
> Azure Maps built-in role definitions provide a very large authorization access to many Azure Maps REST APIs. To restrict APIs access to a minimum, see [create a custom role definition and assign the system-assigned identity](../../role-based-access-control/custom-roles.md) to the custom role definition. This enables the least privilege necessary for the application to access Azure Maps.
