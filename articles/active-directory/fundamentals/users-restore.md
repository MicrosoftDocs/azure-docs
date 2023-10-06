---
title: Restore or permanently remove recently deleted user
description: How to view restorable users, restore a deleted user, or permanently delete a user with Microsoft Entra ID.
services: active-directory
author: barclayn
manager: amycolannino

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 11/07/2022
ms.author: barclayn 
ms.reviewer: jeffsta
---
# Restore or remove a recently deleted user

After you delete a user, the account remains in a suspended state for 30 days. During that 30-day window, the user account can be restored, along with all its properties. After that 30-day window passes, the permanent deletion process is automatically started and can't be stopped. During this time, the management of soft-deleted users is blocked. This limitation also applies to restoring a soft-deleted user via a match during Tenant sync cycle for on-premises hybrid scenarios.

You can view your restorable users, restore a deleted user, or permanently delete a user using the Microsoft Entra admin center.

> [!IMPORTANT]
> Neither you nor Microsoft customer support can restore a permanently deleted user.

## Required permissions

You must have one of the following roles to restore and permanently delete users.

- Global Administrator
- Partner Tier1 Support
- Partner Tier2 Support
- User Administrator

## View your restorable users

You can see all the users that were deleted less than 30 days ago. These users can be restored.

### To view your restorable users

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).

1. Browse to **Identity** > **Users** > **Deleted users**.

    Review the list of users that are available to restore.

    ![Users - Deleted users page, with users that can still be restored](media/users-restore/users-deleted-users-view-restorable.png)

## Restore a recently deleted user

When a user account is deleted from the organization, the account is in a suspended state. All of the account's organization information is preserved. When you restore a user, this organization information is also restored.

> [!NOTE]
> Once a user is restored, licenses that were assigned to the user at the time of deletion are also restored even if there are no seats available for those licenses. If you are then consuming more licenses more than you purchased, your organization could be temporarily out of compliance for license usage.

### To restore a user

1. On the **Deleted users** page, search for and select one of the available users. For example, _Mary Parker_.

2. Select **Restore user**.

    ![Users - Deleted users page, with Restore user option highlighted](media/users-restore/users-deleted-users-restore-user.png)

## Permanently delete a user

You can permanently delete a user from your organization without waiting the 30 days for automatic deletion. A permanently deleted user can't be restored by you, another administrator, nor by Microsoft customer support.

>[!Note]
>If you permanently delete a user by mistake, you'll have to create a new user and manually enter all the previous information. For more information about creating a new user, see [Add or delete users](./add-users.md).

### To permanently delete a user

1. On the **Deleted users** page, search for and select one of the available users. For example, _Rae Huff_.

2. Select **Delete permanently**.

    ![Users - Deleted users page, with Delete user option highlighted](media/users-restore/users-deleted-users-permanent-delete-user.png)

## Next steps

After you've restored or deleted your users, you can:

- [Add or delete users](./add-users.md)

- [Assign roles to users](./how-subscriptions-associated-directory.md)

- [Add or change profile information](./how-to-manage-user-profile-info.md)

- [Add guest users from another organization](../external-identities/what-is-b2b.md)

For more information about other available user management tasks, [Microsoft Entra user management documentation](../enterprise-users/index.yml).
