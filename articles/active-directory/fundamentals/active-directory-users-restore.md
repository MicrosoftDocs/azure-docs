---
title: How to restore or permanently remove a recently deleted user in Azure Active Directory | Microsoft Docs
description: How to view restorable users, restore a deleted user, or permanently delete a user with Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: lizross 
ms.reviewer: jeffsta
ms.custom: it-pro
---

# How to: Restore or permanently remove a recently deleted user with Azure Active Directory
After you delete a user, the account remains in a suspended state for 30 days. During that 30 days the user account can be restored, along with all of its properties. You can view your restorable users, restore a deleted user, or permanently delete a user using Azure Active Directory (Azure AD).

>[!Important]
>Permanently deleted users can't be restored.

## Required permissions
You must have one of the following roles to restore and permanently delete users.

- Company Administrator

- Partner Tier1 Support

- Partner Tier2 Support

- User Account Administrator

## View your restorable users
You can see all of the users that you've recently deleted and that are still within the 30-day account suspension. These users are able to be restored.

### To view your restorable users
1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, select **Users**, and then select **Deleted users**.

    Review the list of users that are still available to restore.

    ![Users - Deleted users page, with users that can still be restored](media/active-directory-users-restore/users-deleted-users-view-restorable.png)

## Restore a recently deleted user
While a user's account is suspended, all of the related directory information is preserved. When you restore a user, this directory information is also restored.

### To restore a user
1. On the **Users - Deleted users** page, search for and select one of the available users. For example, _Mary Parker_.

2. Select **Restore user**.

    ![Users - Deleted users page, with Restore user option highlighted](media/active-directory-users-restore/users-deleted-users-restore-user.png)

## Permanently delete a user
You can permanently delete a user from your tenant without waiting the 30 days. However, this action is permanent and you can't restore a permanently deleted user.

>[!Note]
>If you permanently delete a user by mistake, you'll have to create a new user and manually enter all of the previous information. For more information about creating a new user, see [Add or delete users](add-users-azure-active-directory.md).

### To permanently delete a user

1. On the **Users - Deleted users** page, search for and select one of the available users. For example, _Rae Huff_.

2. Select **Delete permanently**.

    ![Users - Deleted users page, with Restore user option highlighted](media/active-directory-users-restore/users-deleted-users-permanent-delete-user.png)

## Next steps
These articles provide additional information on Azure Active Directory user management.

* [Quickstart: Add or delete users to Azure Active Directory](add-users-azure-active-directory.md)
* [Manage user profiles](active-directory-users-profile-azure-portal.md)
* [Add guest users from another directory](../b2b/what-is-b2b.md) 
* [Assign a user to a role in your Azure AD](active-directory-users-assign-role-azure-portal.md)

After you've restored or deleted your users, you can perform the following basic processes:

- [Add or delete users](add-users-azure-active-directory.md)

- [Assign roles to users](active-directory-users-assign-role-azure-portal.md)

- [Add or change profile information](active-directory-users-profile-azure-portal.md)

- [Add guest users from another directory](../b2b/what-is-b2b.md) 

Or you can perform more complex user scenarios, such as assigning delegates, using policies, and sharing user accounts. For more information about other available actions, see [Azure Active Directory user management documentation](../users-groups-roles/index.yml).
