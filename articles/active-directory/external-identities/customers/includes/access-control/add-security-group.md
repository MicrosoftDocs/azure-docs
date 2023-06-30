---
author: henrymbuguakiarie
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 06/29/2023
ms.author: henrymbugua
---

Security groups manage user and computer access to shared resources. You can create a security group so that all group members have the same set of security permissions.

To create the `Contoso_App_Administrators` security group, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../customers/media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your Azure AD customer tenant in which you want to create the security group.
1. On the sidebar menu, select **Azure Active Directory**.
1. Select **Groups** > **All groups** > **New group**.
1. Under **Group type** dropdown, select **Security**.
1. Enter **Group name** for the security group, such as `Contoso_App_Administrators`.
1. Enter **Group description** for the security group, such as `Contoso app security administrator`.
1. Select **Create**.

The new security group appears in the **All groups** list. If necessary, refresh the page.