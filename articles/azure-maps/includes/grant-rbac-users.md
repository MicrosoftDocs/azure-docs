---
title: Grant role-based access for users
titleSuffix: Azure Maps
description: Use role-based access control to grant users authorization to Azure Maps
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/17/2020
ms.topic: include
ms.service: azure-maps
services: azure-maps
manager: timlt
---

## Grant role-based access for users to Azure Maps

You grant *Azure role-based access control (Azure RBAC)* by assigning either an Azure AD group or security principals to one or more Azure Maps role definitions. To view Azure role definitions that are available for Azure Maps, go to **Access control (IAM)**. Select **Roles**, and then search for roles that begin with *Azure Maps*.

* To efficiently manage a large amount of users' access to Azure Maps, see [Azure AD Groups](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-manage-groups).
* For users to be allowed to authenticate to the application, the users must be created in Azure AD. See [Add or Delete users using Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/add-users-azure-active-directory).

Read more on [Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/) to effectively manage a directory for users.

1. Go to your **Azure Maps Account**. Select **Access control (IAM)** > **Role assignment**.

    ![Grant access using Azure RBAC](../media/how-to-manage-authentication/how-to-grant-rbac.png)

2. On the **Role assignments** tab, under **Role**, select a built in Azure Maps role definition such as **Azure Maps Data Reader** or **Azure Maps Data Contributor**. Under **Assign access to**, select **Azure AD user, group, or service principal**. Select the principal by name. Then select **Save**.

   * See details on [Add or remove role assignments](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).

> [!WARNING]
> Azure Maps built-in role definitions provide a very large authorization access to many Azure Maps REST APIs. To restrict APIs for users to a minimum, see [create a custom role definition and assign users](https://docs.microsoft.com/azure/role-based-access-control/custom-roles) to the custom role definition. This will enable users to have the least privilege necessary for the application.