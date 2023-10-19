---

title: Reset a user's password
description: Instructions about how to reset a user's password using Microsoft Entra ID.
services: active-directory
author: barclayn
manager: amycolannino

ms.assetid: fad5624b-2f13-4abc-b3d4-b347903a8f16
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 01/23/2023
ms.author: barclayn
ms.reviewer: jeffsta
---
# Reset a user's password

Administrators can reset a user's password if the password is forgotten, if the user gets locked out of a device, or if the user never received a password.

> [!NOTE]
> If you're not an administrator and you need instructions on how to reset your own work or school password, see [Reset your work or school password](https://support.microsoft.com/account-billing/reset-your-work-or-school-password-using-security-info-23dde81f-08bb-4776-ba72-e6b72b9dda9e).
>
> Unless your tenant is the home directory for a user, you won't be able reset their password. This means that if your user is signing in to your organization using an account from another organization, a Microsoft account, or a Google account, you won't be able to reset their password.
>
> If your user has a source of authority as Windows Server Active Directory, you'll only be able to reset the password if you've turned on password writeback and the user domain is managed. Changing the user password for federated domains is not supported. In this case, you should change the user password in the on-premises Active Directory.
>
> If your user has a source of authority as External Microsoft Entra ID, you won't be able to reset the password. Only the user, or an administrator in that tenant, can reset the password.

## To reset a password

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Password Administrator](../roles/permissions-reference.md#password-administrator).

1. Browse to **Identity** > **Users** > **All users**.

1. Select the user that needs the reset, then select **Reset Password**.

    The **Alain Charon - Profile** page appears with the **Reset password** option.

    ![User's profile page, with Reset password option highlighted](media/users-reset-password-azure-portal/user-profile-reset-password-link.png)

1. In the **Reset password** page, select **Reset password**.

    > [!NOTE]
    > When using Microsoft Entra ID, a temporary password is auto-generated for the user. When using Active Directory on-premises, you create the password for the user.

1. Copy the password and give it to the user. The user will be required to change the password during the next sign-in process.

    > [!NOTE]
    > The temporary password never expires. The next time the user signs in, the password will still work, regardless how much time has passed since the temporary password was generated.

> [!IMPORTANT]
> If an administrator is unable to reset the user's password, and the Application Event Logs on the Microsoft Entra Connect server has error code hr=80231367, review the user's attributes in Active Directory.  If the attribute **AdminCount** is set to 1, this will prevent an administrator from resetting the user's password.  The attribute **AdminCount** must be set to 0, in order for an administrators to reset the user's password.

## Next steps

After you've reset your user's password, you can perform the following basic processes:

- [Add or delete users](./add-users.md)
- [Assign roles to users](./how-subscriptions-associated-directory.md)
- [Add or change profile information](./how-to-manage-user-profile-info.md)
- [Create a basic group and add members](./how-to-manage-groups.md)

Or you can perform more complex user scenarios, such as assigning delegates, using policies, and sharing user accounts. For more information about other available actions, see [Microsoft Entra user management documentation](../enterprise-users/index.yml).
