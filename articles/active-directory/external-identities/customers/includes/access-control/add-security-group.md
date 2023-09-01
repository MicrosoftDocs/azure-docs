---
author: henrymbuguakiarie
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/12/2023
ms.author: henrymbugua
---

Security groups manage user and computer access to shared resources. You can create a security group so that all group members have the same set of security permissions.

To create a security group, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. If you have access to multiple tenants, make sure you're using the directory that contains your customer tenant:
    1. Select the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: icon in the top menu.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch** button next to the Azure AD customer tenant in which you want to create the security group.
1. On the sidebar menu, select **Azure Active Directory**.
1. Select **Groups** > **All groups** > **New group**.
1. Under **Group type** dropdown, select **Security**.
1. Enter **Group name** for the security group, such as _Contoso_App_Administrators_.
1. Enter **Group description** for the security group, such as _Contoso app security administrator_.
1. Select **Create**.

The new security group appears in the **All groups** list. If you don't see it immediately, refresh the page.